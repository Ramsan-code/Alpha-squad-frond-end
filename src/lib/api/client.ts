/**
 * Enhanced API Client - Production-Ready HTTP Client Wrapper
 * 
 * This module provides a robust, type-safe HTTP client for frontend-backend communication.
 * Features:
 * - Automatic token injection
 * - Request/response interceptors
 * - Timeout handling
 * - Retry logic with exponential backoff
 * - Comprehensive error handling
 * - Request cancellation support
 */

import { ApiError, ApiResponse, FetchOptions, HttpMethod } from './types';
import { apiConfig, tokenStorage } from './config';

// ============================================================================
// Request Interceptor Type
// ============================================================================

type RequestInterceptor = (config: {
    url: string;
    options: RequestInit;
}) => Promise<{ url: string; options: RequestInit }> | { url: string; options: RequestInit };

type ResponseInterceptor = <T>(response: T) => Promise<T> | T;

type ErrorInterceptor = (error: ApiError) => Promise<never>;

// ============================================================================
// API Client Class
// ============================================================================

class ApiClient {
    private requestInterceptors: RequestInterceptor[] = [];
    private responseInterceptors: ResponseInterceptor[] = [];
    private errorInterceptors: ErrorInterceptor[] = [];

    constructor() {
        // Set up default interceptors
        this.setupDefaultInterceptors();
    }

    /**
     * Set up default interceptors for auth, logging, etc.
     */
    private setupDefaultInterceptors(): void {
        // Add auth token to requests
        this.addRequestInterceptor(({ url, options }) => {
            const token = tokenStorage.getToken();

            if (token) {
                const headers = new Headers(options.headers);
                headers.set('Authorization', `Bearer ${token}`);
                options.headers = headers;
            }

            return { url, options };
        });

        // Handle auth errors globally
        this.addErrorInterceptor(async (error) => {
            if (error.isAuthError() && typeof window !== 'undefined') {
                // Clear token and redirect to login on 401
                tokenStorage.clearToken();

                // Only redirect if not already on auth page
                if (!window.location.pathname.startsWith('/login')) {
                    console.warn('[API Client] Authentication expired. Redirecting to login.');
                    // Don't use window.location.href directly - let the app handle redirect
                }
            }
            throw error;
        });
    }

    /**
     * Add a request interceptor
     */
    addRequestInterceptor(interceptor: RequestInterceptor): void {
        this.requestInterceptors.push(interceptor);
    }

    /**
     * Add a response interceptor
     */
    addResponseInterceptor(interceptor: ResponseInterceptor): void {
        this.responseInterceptors.push(interceptor);
    }

    /**
     * Add an error interceptor
     */
    addErrorInterceptor(interceptor: ErrorInterceptor): void {
        this.errorInterceptors.push(interceptor);
    }

    /**
     * Execute a fetch request with all configurations and interceptors
     */
    private async execute<T>(
        method: HttpMethod,
        endpoint: string,
        body?: unknown,
        options: FetchOptions = {}
    ): Promise<T> {
        const {
            params,
            timeout = apiConfig.timeout,
            retries = method === 'GET' ? apiConfig.retries : 0, // Only retry GET by default
            retryDelay = apiConfig.retryDelay,
            ...fetchOptions
        } = options;

        // Build URL with query params
        const url = apiConfig.buildUrl(endpoint, params as Record<string, string>);

        // Build initial request options
        let requestOptions: RequestInit = {
            method,
            ...fetchOptions,
            headers: {
                ...apiConfig.defaultHeaders,
                ...(fetchOptions.headers as Record<string, string>),
            },
        };

        // Add body for non-GET requests
        if (body && method !== 'GET') {
            requestOptions.body = JSON.stringify(body);
        }

        // Run request interceptors
        let interceptedConfig = { url: url.toString(), options: requestOptions };
        for (const interceptor of this.requestInterceptors) {
            interceptedConfig = await interceptor(interceptedConfig);
        }

        // Execute with retry logic
        return this.executeWithRetry<T>(
            interceptedConfig.url,
            interceptedConfig.options,
            timeout,
            retries,
            retryDelay
        );
    }

    /**
     * Execute request with retry logic and timeout
     */
    private async executeWithRetry<T>(
        url: string,
        options: RequestInit,
        timeout: number,
        retries: number,
        retryDelay: number,
        attempt: number = 0
    ): Promise<T> {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            // Parse response body
            const contentType = response.headers.get('content-type');
            let data: unknown;

            if (contentType?.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            // Handle error responses
            if (!response.ok) {
                const apiError = this.createApiError(response, data);

                // Run error interceptors
                for (const interceptor of this.errorInterceptors) {
                    await interceptor(apiError);
                }

                throw apiError;
            }

            // Run response interceptors
            let result = data as T;
            for (const interceptor of this.responseInterceptors) {
                result = await interceptor(result);
            }

            return result;
        } catch (error) {
            clearTimeout(timeoutId);

            // Handle abort/timeout
            if (error instanceof Error && error.name === 'AbortError') {
                throw new ApiError(
                    `Request timeout after ${timeout}ms`,
                    408,
                    undefined,
                    true
                );
            }

            // Handle network errors
            if (error instanceof TypeError && error.message.includes('fetch')) {
                const networkError = new ApiError(
                    'Network error: Unable to reach the server. Please check your connection.',
                    0,
                    undefined,
                    true
                );

                // Retry on network errors
                if (attempt < retries) {
                    console.warn(`[API Client] Network error, retrying (${attempt + 1}/${retries})...`);
                    await this.delay(retryDelay * Math.pow(2, attempt)); // Exponential backoff
                    return this.executeWithRetry(url, options, timeout, retries, retryDelay, attempt + 1);
                }

                throw networkError;
            }

            // Re-throw API errors
            if (error instanceof ApiError) {
                // Retry on server errors (5xx)
                if (error.isServerError() && attempt < retries) {
                    console.warn(`[API Client] Server error, retrying (${attempt + 1}/${retries})...`);
                    await this.delay(retryDelay * Math.pow(2, attempt));
                    return this.executeWithRetry(url, options, timeout, retries, retryDelay, attempt + 1);
                }
                throw error;
            }

            // Unknown error
            throw new ApiError(
                error instanceof Error ? error.message : 'An unexpected error occurred',
                500,
                undefined,
                false
            );
        }
    }

    /**
     * Create an ApiError from a response
     */
    private createApiError(response: Response, data: unknown): ApiError {
        const errorData = data as { message?: string; errors?: Array<{ field: string; message: string }> };

        return new ApiError(
            errorData?.message || `API Error: ${response.statusText}`,
            response.status,
            errorData?.errors,
            false
        );
    }

    /**
     * Delay utility for retry logic
     */
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ===========================================================================
    // Public HTTP Methods
    // ===========================================================================

    /**
     * GET request
     */
    get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
        return this.execute<T>('GET', endpoint, undefined, { params });
    }

    /**
     * POST request
     */
    post<T>(endpoint: string, body: unknown, options?: FetchOptions): Promise<T> {
        return this.execute<T>('POST', endpoint, body, options);
    }

    /**
     * PUT request
     */
    put<T>(endpoint: string, body: unknown, options?: FetchOptions): Promise<T> {
        return this.execute<T>('PUT', endpoint, body, options);
    }

    /**
     * PATCH request
     */
    patch<T>(endpoint: string, body: unknown, options?: FetchOptions): Promise<T> {
        return this.execute<T>('PATCH', endpoint, body, options);
    }

    /**
     * DELETE request
     */
    delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
        return this.execute<T>('DELETE', endpoint, undefined, options);
    }
}

// ============================================================================
// Singleton Export
// ============================================================================

/**
 * Default API client instance
 * Use this for all API communications
 */
export const api = new ApiClient();

/**
 * Re-export types for convenience
 */
export { ApiError, type ApiResponse } from './types';
export { apiConfig, tokenStorage } from './config';
