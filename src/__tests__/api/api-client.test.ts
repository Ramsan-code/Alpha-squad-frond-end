/**
 * API Client Tests
 * 
 * Tests for the core API client functionality including:
 * - Configuration validation
 * - Request/response handling
 * - Error handling
 * - Token management
 */

import { apiConfig, tokenStorage } from '@/lib/api/config';
import { ApiError } from '@/lib/api/types';

describe('API Configuration', () => {
    describe('apiConfig', () => {
        it('should have a valid base URL', () => {
            expect(apiConfig.baseUrl).toBeDefined();
            expect(typeof apiConfig.baseUrl).toBe('string');
        });

        it('should not have trailing slash in base URL', () => {
            expect(apiConfig.baseUrl.endsWith('/')).toBe(false);
        });

        it('should have reasonable timeout value', () => {
            expect(apiConfig.timeout).toBeGreaterThan(0);
            expect(apiConfig.timeout).toBeLessThanOrEqual(60000);
        });

        it('should have positive retry count', () => {
            expect(apiConfig.retries).toBeGreaterThanOrEqual(0);
            expect(apiConfig.retries).toBeLessThanOrEqual(5);
        });

        it('should have default headers', () => {
            expect(apiConfig.defaultHeaders).toHaveProperty('Content-Type', 'application/json');
            expect(apiConfig.defaultHeaders).toHaveProperty('Accept', 'application/json');
        });

        it('should build URL correctly without params', () => {
            const url = apiConfig.buildUrl('/test');
            expect(url.pathname).toContain('/test');
        });

        it('should build URL correctly with params', () => {
            const url = apiConfig.buildUrl('/test', { foo: 'bar', baz: 123 });
            expect(url.searchParams.get('foo')).toBe('bar');
            expect(url.searchParams.get('baz')).toBe('123');
        });

        it('should ignore undefined and null params', () => {
            const url = apiConfig.buildUrl('/test', {
                valid: 'value',
                invalid: undefined,
                empty: '',
            });
            expect(url.searchParams.get('valid')).toBe('value');
            expect(url.searchParams.has('invalid')).toBe(false);
            expect(url.searchParams.has('empty')).toBe(false);
        });

        it('should identify public endpoints correctly', () => {
            expect(apiConfig.isPublicEndpoint('/auth/login')).toBe(true);
            expect(apiConfig.isPublicEndpoint('/auth/register/student')).toBe(true);
            expect(apiConfig.isPublicEndpoint('/courses')).toBe(true);
            expect(apiConfig.isPublicEndpoint('/courses/123')).toBe(true);
            expect(apiConfig.isPublicEndpoint('/admin/users')).toBe(false);
        });
    });

    describe('tokenStorage', () => {
        beforeEach(() => {
            tokenStorage.clearToken();
        });

        it('should return null when no token is stored', () => {
            expect(tokenStorage.getToken()).toBeNull();
        });

        it('should store and retrieve token from localStorage', () => {
            tokenStorage.setToken('test-token', true);
            expect(tokenStorage.getToken()).toBe('test-token');
            expect(localStorage.setItem).toHaveBeenCalledWith('lms_token', 'test-token');
        });

        it('should store and retrieve token from sessionStorage', () => {
            tokenStorage.setToken('session-token', false);
            expect(tokenStorage.getToken()).toBe('session-token');
            expect(sessionStorage.setItem).toHaveBeenCalledWith('lms_token', 'session-token');
        });

        it('should clear token from both storages', () => {
            tokenStorage.setToken('test-token', true);
            tokenStorage.clearToken();
            expect(localStorage.removeItem).toHaveBeenCalledWith('lms_token');
            expect(sessionStorage.removeItem).toHaveBeenCalledWith('lms_token');
        });

        it('should correctly report hasToken status', () => {
            expect(tokenStorage.hasToken()).toBe(false);
            tokenStorage.setToken('test-token', true);
            expect(tokenStorage.hasToken()).toBe(true);
            tokenStorage.clearToken();
            expect(tokenStorage.hasToken()).toBe(false);
        });
    });
});

describe('ApiError', () => {
    it('should create error with all properties', () => {
        const error = new ApiError('Test error', 400, [{ field: 'email', message: 'Invalid' }]);

        expect(error.message).toBe('Test error');
        expect(error.statusCode).toBe(400);
        expect(error.errors).toHaveLength(1);
        expect(error.isNetworkError).toBe(false);
    });

    it('should correctly identify auth errors (401)', () => {
        const authError = new ApiError('Unauthorized', 401);
        expect(authError.isAuthError()).toBe(true);
        expect(authError.isForbiddenError()).toBe(false);

        const otherError = new ApiError('Not Found', 404);
        expect(otherError.isAuthError()).toBe(false);
    });

    it('should correctly identify forbidden errors (403)', () => {
        const forbiddenError = new ApiError('Forbidden', 403);
        expect(forbiddenError.isForbiddenError()).toBe(true);
        expect(forbiddenError.isAuthError()).toBe(false);
    });

    it('should correctly identify validation errors (400, 422)', () => {
        const badRequest = new ApiError('Bad Request', 400);
        const unprocessable = new ApiError('Unprocessable', 422);

        expect(badRequest.isValidationError()).toBe(true);
        expect(unprocessable.isValidationError()).toBe(true);

        const notFound = new ApiError('Not Found', 404);
        expect(notFound.isValidationError()).toBe(false);
    });

    it('should correctly identify not found errors (404)', () => {
        const notFound = new ApiError('Not Found', 404);
        expect(notFound.isNotFoundError()).toBe(true);
    });

    it('should correctly identify server errors (5xx)', () => {
        const serverError = new ApiError('Internal Server Error', 500);
        const badGateway = new ApiError('Bad Gateway', 502);

        expect(serverError.isServerError()).toBe(true);
        expect(badGateway.isServerError()).toBe(true);

        const clientError = new ApiError('Not Found', 404);
        expect(clientError.isServerError()).toBe(false);
    });

    it('should correctly identify network errors', () => {
        const networkError = new ApiError('Network error', 0, undefined, true);
        expect(networkError.isNetworkError).toBe(true);

        const apiError = new ApiError('API error', 500);
        expect(apiError.isNetworkError).toBe(false);
    });
});
