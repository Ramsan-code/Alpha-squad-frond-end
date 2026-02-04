/**
 * API Module - Public API for frontend-backend communication
 * 
 * This is the main entry point for all API-related functionality.
 * Import from this file to access the API client, types, and utilities.
 */

// Core API client
export { api, ApiError, apiConfig, tokenStorage } from './client';

// Types
export type {
    ApiResponse,
    ApiValidationError,
    PaginatedResponse,
    PaginationParams,
    RequestState,
    RequestConfig,
    FetchOptions,
    HttpMethod,
} from './types';

// Request state factories
export {
    createInitialRequestState,
    createLoadingRequestState,
    createSuccessRequestState,
    createErrorRequestState,
} from './types';

// Configuration utilities
export { getApiEnvironment, isProduction, isDevelopment } from './config';
