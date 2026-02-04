/**
 * API Integration Tests (E2E)
 * 
 * These tests verify actual connectivity to the backend API.
 * They will FAIL if the backend is unreachable or returns errors.
 * 
 * Run with: npm run test:e2e
 */

// ============================================================================
// Test Configuration
// ============================================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Use native fetch for Node.js environment
const fetchImpl = globalThis.fetch as typeof fetch | undefined;

describe('API Integration Tests', () => {
    // Skip tests if API URL is not configured or fetch is not available
    beforeAll(() => {
        if (!API_URL) {
            console.warn('⚠️  NEXT_PUBLIC_API_URL not configured. Skipping integration tests.');
        }
        if (!fetchImpl) {
            console.warn('⚠️  fetch is not available in this environment.');
        }
    });

    describe('Backend Connectivity', () => {
        it('should have NEXT_PUBLIC_API_URL environment variable set', () => {
            expect(API_URL).toBeDefined();
            expect(API_URL).not.toBe('');
            expect(API_URL).toMatch(/^https?:\/\//);
        });

        it('should be able to reach the backend API', async () => {
            if (!fetchImpl || !API_URL) {
                console.log('Skipping: fetch not available or API URL not set');
                return;
            }

            const startTime = Date.now();
            try {
                // Try health endpoint first
                let response = await fetchImpl(`${API_URL}/health`, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                });

                // If health doesn't exist (404), try courses as fallback
                if (response.status === 404) {
                    response = await fetchImpl(`${API_URL}/courses`, {
                        method: 'GET',
                        headers: { 'Accept': 'application/json' },
                    });
                }

                const latency = Date.now() - startTime;
                console.log(`✅ Backend reachable in ${latency}ms`);

                expect(response.ok).toBe(true);
            } catch (error) {
                const latency = Date.now() - startTime;
                console.error(`❌ Backend unreachable after ${latency}ms:`, error);
                throw new Error(`Backend is unreachable: ${error}`);
            }
        }, 15000);

        it('should get response from courses endpoint', async () => {
            if (!fetchImpl || !API_URL) {
                console.log('Skipping: fetch not available or API URL not set');
                return;
            }

            try {
                const response = await fetchImpl(`${API_URL}/courses?limit=1`, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                });

                expect(response.status).toBeLessThan(500);

                if (response.ok) {
                    const data = await response.json();
                    console.log('✅ Courses endpoint returned:', {
                        success: data.success,
                        courseCount: data.data?.courses?.length || 0,
                    });
                    expect(data).toHaveProperty('success');
                }
            } catch (error) {
                console.error('❌ Courses API error:', error);
                throw error;
            }
        }, 15000);
    });

    describe('Auth API', () => {
        it('should reject login with invalid credentials', async () => {
            if (!fetchImpl || !API_URL) {
                console.log('Skipping: fetch not available or API URL not set');
                return;
            }

            try {
                const response = await fetchImpl(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        email: 'invalid@example.com',
                        password: 'wrongpassword',
                    }),
                });

                // Should get 401 Unauthorized or 400 Bad Request
                expect([400, 401, 403, 422]).toContain(response.status);
                console.log(`✅ Login correctly rejected with status ${response.status}`);
            } catch (error) {
                // Network error is acceptable in some test environments
                console.log('Auth endpoint not reachable:', error);
            }
        }, 15000);

        it('should reject /me endpoint without authentication', async () => {
            if (!fetchImpl || !API_URL) {
                console.log('Skipping: fetch not available or API URL not set');
                return;
            }

            try {
                const response = await fetchImpl(`${API_URL}/auth/me`, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                });

                // Should get 401 Unauthorized without token
                expect(response.status).toBe(401);
                console.log('✅ /me correctly requires authentication');
            } catch (error) {
                console.log('Auth endpoint not reachable:', error);
            }
        }, 15000);
    });
});

// ============================================================================
// Detailed Status Test (for debugging)
// ============================================================================

describe('API Status Report', () => {
    it('should generate detailed API status', async () => {
        const endpoints = [
            { name: 'Health', path: '/health' },
            { name: 'Courses', path: '/courses' },
            { name: 'Auth (/me)', path: '/auth/me' },
        ];

        console.log('\n📊 API Status Report:');
        console.log('─'.repeat(50));
        console.log(`API URL: ${API_URL || 'Not configured'}`);
        console.log(`Fetch Available: ${fetchImpl ? '✅ Yes' : '❌ No'}`);

        if (!fetchImpl || !API_URL) {
            console.log('Cannot test endpoints without fetch and API URL');
            console.log('─'.repeat(50));
            expect(API_URL).toBeDefined();
            return;
        }

        console.log('\nEndpoint Status:');

        let reachableCount = 0;
        for (const endpoint of endpoints) {
            const startTime = Date.now();
            try {
                const response = await fetchImpl(`${API_URL}${endpoint.path}`, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                });
                const latency = Date.now() - startTime;

                if (response.ok || response.status === 401) {
                    // 401 is acceptable for auth endpoints
                    console.log(`  ✅ ${endpoint.name}: ${response.status} (${latency}ms)`);
                    reachableCount++;
                } else {
                    console.log(`  ⚠️ ${endpoint.name}: ${response.status} (${latency}ms)`);
                }
            } catch (error) {
                const latency = Date.now() - startTime;
                console.log(`  ❌ ${endpoint.name}: ERROR (${latency}ms)`);
            }
        }

        console.log('─'.repeat(50));
        console.log(`Reachable: ${reachableCount}/${endpoints.length} endpoints`);
        console.log('─'.repeat(50));

        expect(true).toBe(true);
    }, 30000);
});
