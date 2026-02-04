/**
 * API Configuration - Centralized configuration for API client
 * 
 * This module validates and exports environment configuration for API communication.
 * It serves as the single source of truth for API-related settings.
 */

// ============================================================================
// Environment Validation
// ============================================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Validate required environment variables at startup
 * This ensures we catch configuration errors early
 */
function validateEnvironment(): void {
    if (!API_URL) {
        console.error(
            '[API Config] ⚠️ NEXT_PUBLIC_API_URL is not defined.\n' +
            'Please set it in your .env.local file:\n' +
            'NEXT_PUBLIC_API_URL=https://alpha-squad-back-end.vercel.app/api'
        );
    }
}

// Run validation on module load
validateEnvironment();

// ============================================================================
// Configuration Object
// ============================================================================

/**
 * API configuration object
 * Centralizes all API-related settings in one place
 */
export const apiConfig = {
    /**
     * Base URL for API requests (without trailing slash)
     */
    baseUrl: API_URL?.replace(/\/$/, '') || '',

    /**
     * Default request timeout in milliseconds
     */
    timeout: 30000,

    /**
     * Number of retry attempts for failed requests
     */
    retries: 3,

    /**
     * Delay between retry attempts in milliseconds
     */
    retryDelay: 1000,

    /**
     * Token storage key for localStorage/sessionStorage
     */
    tokenKey: 'lms_token',

    /**
     * User storage key for localStorage/sessionStorage
     */
    userKey: 'lms_user',

    /**
     * Default headers for all requests
     */
    defaultHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },

    /**
     * Endpoints that don't require authentication
     */
    publicEndpoints: [
        '/auth/login',
        '/auth/register/student',
        '/auth/register/teacher',
        '/auth/register/review',
        '/auth/forgot-password',
        '/auth/reset-password',
        '/courses', // Public course listing
        '/health', // Health check
    ],

    /**
     * Check if an endpoint is public (doesn't require auth token)
     */
    isPublicEndpoint(endpoint: string): boolean {
        return this.publicEndpoints.some(
            pub => endpoint === pub || endpoint.startsWith(pub + '/')
        );
    },

    /**
     * Build full URL from endpoint
     */
    buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): URL {
        // Ensure no double slashes
        const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

        // Use a fallback base URL for testing when env var is not set
        const base = this.baseUrl || 'http://localhost:5000/api';
        const url = new URL(`${base}${path}`);

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    url.searchParams.append(key, String(value));
                }
            });
        }

        return url;
    },
} as const;

// ============================================================================
// Token Management
// ============================================================================

/**
 * Token storage utilities
 * Handles secure token storage and retrieval
 */
export const tokenStorage = {
    /**
     * Get the stored authentication token
     */
    getToken(): string | null {
        if (typeof window === 'undefined') return null;

        return (
            localStorage.getItem(apiConfig.tokenKey) ||
            sessionStorage.getItem(apiConfig.tokenKey)
        );
    },

    /**
     * Store authentication token
     * @param token - JWT token to store
     * @param remember - If true, stores in localStorage; otherwise sessionStorage
     */
    setToken(token: string, remember: boolean = true): void {
        if (typeof window === 'undefined') return;

        if (remember) {
            localStorage.setItem(apiConfig.tokenKey, token);
            sessionStorage.removeItem(apiConfig.tokenKey);
        } else {
            sessionStorage.setItem(apiConfig.tokenKey, token);
            localStorage.removeItem(apiConfig.tokenKey);
        }
    },

    /**
     * Remove stored authentication token
     */
    clearToken(): void {
        if (typeof window === 'undefined') return;

        localStorage.removeItem(apiConfig.tokenKey);
        sessionStorage.removeItem(apiConfig.tokenKey);
    },

    /**
     * Check if a token is stored
     */
    hasToken(): boolean {
        return this.getToken() !== null;
    },
};

// ============================================================================
// Utility Types
// ============================================================================

export type ApiEnvironment = 'development' | 'staging' | 'production';

/**
 * Get current API environment based on URL
 */
export function getApiEnvironment(): ApiEnvironment {
    if (apiConfig.baseUrl.includes('localhost')) return 'development';
    if (apiConfig.baseUrl.includes('staging')) return 'staging';
    return 'production';
}

/**
 * Check if running in production environment
 */
export function isProduction(): boolean {
    return getApiEnvironment() === 'production';
}

/**
 * Check if running in development environment
 */
export function isDevelopment(): boolean {
    return getApiEnvironment() === 'development';
}
