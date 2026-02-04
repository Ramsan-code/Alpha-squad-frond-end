/**
 * Health Service - API health check and connectivity testing
 * 
 * This service provides methods to verify backend connectivity
 * and is used in tests and startup checks.
 */

import { api, ApiResponse } from '@/lib/api';

// ============================================================================
// Types
// ============================================================================

export interface HealthStatus {
    status: 'ok' | 'degraded' | 'error';
    timestamp: string;
    version?: string;
    uptime?: number;
}

export interface ConnectivityResult {
    isConnected: boolean;
    latencyMs: number;
    error?: string;
    healthStatus?: HealthStatus;
}

// ============================================================================
// Health Service
// ============================================================================

export const healthService = {
    /**
     * Check if the backend is reachable and healthy
     */
    async checkHealth(): Promise<ApiResponse<HealthStatus>> {
        return api.get<ApiResponse<HealthStatus>>('/health');
    },

    /**
     * Perform a connectivity test with latency measurement
     */
    async testConnectivity(): Promise<ConnectivityResult> {
        const startTime = performance.now();

        try {
            const response = await this.checkHealth();
            const latencyMs = Math.round(performance.now() - startTime);

            return {
                isConnected: response.success,
                latencyMs,
                healthStatus: response.data,
            };
        } catch (error) {
            const latencyMs = Math.round(performance.now() - startTime);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

            return {
                isConnected: false,
                latencyMs,
                error: errorMessage,
            };
        }
    },

    /**
     * Ping the API to verify it's reachable (lightweight check)
     * This uses a simple courses endpoint as fallback if /health doesn't exist
     */
    async ping(): Promise<boolean> {
        try {
            // Try health endpoint first
            await api.get('/health');
            return true;
        } catch {
            try {
                // Fallback to courses endpoint (public, should always work)
                await api.get('/courses', { limit: '1' });
                return true;
            } catch {
                return false;
            }
        }
    },

    /**
     * Get detailed API status including all endpoints
     */
    async getDetailedStatus(): Promise<{
        apiUrl: string;
        isReachable: boolean;
        latencyMs: number;
        endpoints: { name: string; status: 'ok' | 'error'; latencyMs: number }[];
    }> {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'Not configured';
        const endpoints: { name: string; status: 'ok' | 'error'; latencyMs: number }[] = [];

        // Test multiple endpoints
        const endpointsToTest = [
            { name: 'Health', path: '/health' },
            { name: 'Courses', path: '/courses' },
            { name: 'Auth', path: '/auth/me' },
        ];

        for (const endpoint of endpointsToTest) {
            const startTime = performance.now();
            try {
                await api.get(endpoint.path);
                endpoints.push({
                    name: endpoint.name,
                    status: 'ok',
                    latencyMs: Math.round(performance.now() - startTime),
                });
            } catch {
                endpoints.push({
                    name: endpoint.name,
                    status: 'error',
                    latencyMs: Math.round(performance.now() - startTime),
                });
            }
        }

        const isReachable = endpoints.some(e => e.status === 'ok');
        const avgLatency = endpoints.reduce((acc, e) => acc + e.latencyMs, 0) / endpoints.length;

        return {
            apiUrl,
            isReachable,
            latencyMs: Math.round(avgLatency),
            endpoints,
        };
    },
};
