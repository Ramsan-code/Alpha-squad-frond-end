/**
 * API Types - Centralized type definitions for API communication
 * 
 * This file contains all TypeScript types related to API requests and responses.
 * These types ensure type safety across the entire API layer.
 */

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Standard API response wrapper
 * All backend endpoints return responses in this format
 */
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    errors?: ApiValidationError[];
}

/**
 * Validation error from backend
 */
export interface ApiValidationError {
    field: string;
    message: string;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

/**
 * Common pagination parameters
 */
export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// API Error Types
// ============================================================================

/**
 * Structured API error for consistent error handling
 */
export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public errors?: ApiValidationError[],
        public isNetworkError: boolean = false
    ) {
        super(message);
        this.name = 'ApiError';

        // Maintains proper stack trace in V8 environments
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }

    /**
     * Check if error is an authentication error
     */
    isAuthError(): boolean {
        return this.statusCode === 401;
    }

    /**
     * Check if error is a forbidden/authorization error
     */
    isForbiddenError(): boolean {
        return this.statusCode === 403;
    }

    /**
     * Check if error is a validation error
     */
    isValidationError(): boolean {
        return this.statusCode === 400 || this.statusCode === 422;
    }

    /**
     * Check if error is a not found error
     */
    isNotFoundError(): boolean {
        return this.statusCode === 404;
    }

    /**
     * Check if error is a server error
     */
    isServerError(): boolean {
        return this.statusCode >= 500;
    }
}

// ============================================================================
// Request State Types
// ============================================================================

/**
 * Request state for hook-based data fetching
 */
export interface RequestState<T> {
    data: T | null;
    isLoading: boolean;
    error: ApiError | null;
    isSuccess: boolean;
    isError: boolean;
}

/**
 * Initial request state factory
 */
export function createInitialRequestState<T>(): RequestState<T> {
    return {
        data: null,
        isLoading: false,
        error: null,
        isSuccess: false,
        isError: false,
    };
}

/**
 * Loading request state factory
 */
export function createLoadingRequestState<T>(): RequestState<T> {
    return {
        data: null,
        isLoading: true,
        error: null,
        isSuccess: false,
        isError: false,
    };
}

/**
 * Success request state factory
 */
export function createSuccessRequestState<T>(data: T): RequestState<T> {
    return {
        data,
        isLoading: false,
        error: null,
        isSuccess: true,
        isError: false,
    };
}

/**
 * Error request state factory
 */
export function createErrorRequestState<T>(error: ApiError): RequestState<T> {
    return {
        data: null,
        isLoading: false,
        error,
        isSuccess: false,
        isError: true,
    };
}

// ============================================================================
// HTTP Types
// ============================================================================

/**
 * Supported HTTP methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Request configuration options
 */
export interface RequestConfig {
    params?: Record<string, string | number | boolean | undefined>;
    headers?: Record<string, string>;
    timeout?: number;
    signal?: AbortSignal;
    retries?: number;
    retryDelay?: number;
}

/**
 * Internal fetch options
 */
export interface FetchOptions extends RequestInit {
    params?: Record<string, string | number | boolean | undefined>;
    timeout?: number;
    retries?: number;
    retryDelay?: number;
}
