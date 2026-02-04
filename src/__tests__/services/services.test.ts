/**
 * Services Unit Tests
 * 
 * Tests for service layer functionality with mocked API calls
 */

import { authService } from '@/lib/services/auth.service';
import { coursesService } from '@/lib/services/courses.service';
import { healthService } from '@/lib/services/health.service';

// Mock the API client
jest.mock('@/lib/api', () => ({
    api: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),
    },
    ApiResponse: {},
}));

import { api } from '@/lib/api';

const mockedApi = api as jest.Mocked<typeof api>;

describe('Auth Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should call POST /auth/login with credentials', async () => {
            const mockResponse = {
                success: true,
                data: {
                    user: { id: '1', name: 'Test', email: 'test@example.com', role: 'STUDENT' },
                    token: 'jwt-token',
                },
            };
            mockedApi.post.mockResolvedValue(mockResponse);

            const result = await authService.login('test@example.com', 'password123');

            expect(mockedApi.post).toHaveBeenCalledWith('/auth/login', {
                email: 'test@example.com',
                password: 'password123',
            });
            expect(result).toEqual(mockResponse);
        });

        it('should propagate API errors', async () => {
            mockedApi.post.mockRejectedValue(new Error('Invalid credentials'));

            await expect(authService.login('bad@email.com', 'wrong')).rejects.toThrow('Invalid credentials');
        });
    });

    describe('registerStudent', () => {
        it('should call POST /auth/register/student', async () => {
            const mockResponse = { success: true, data: { user: {}, token: 'token' } };
            mockedApi.post.mockResolvedValue(mockResponse);

            await authService.registerStudent('new@example.com', 'password', 'John Doe');

            expect(mockedApi.post).toHaveBeenCalledWith('/auth/register/student', {
                email: 'new@example.com',
                password: 'password',
                name: 'John Doe',
            });
        });
    });

    describe('registerTeacher', () => {
        it('should call POST /auth/register/teacher', async () => {
            const mockResponse = { success: true, data: { user: {}, token: 'token' } };
            mockedApi.post.mockResolvedValue(mockResponse);

            await authService.registerTeacher('teacher@example.com', 'password', 'Jane Smith');

            expect(mockedApi.post).toHaveBeenCalledWith('/auth/register/teacher', {
                email: 'teacher@example.com',
                password: 'password',
                name: 'Jane Smith',
            });
        });
    });

    describe('getMe', () => {
        it('should call GET /auth/me', async () => {
            const mockResponse = {
                success: true,
                data: { user: { id: '1', name: 'Test User' } },
            };
            mockedApi.get.mockResolvedValue(mockResponse);

            const result = await authService.getMe();

            expect(mockedApi.get).toHaveBeenCalledWith('/auth/me');
            expect(result).toEqual(mockResponse);
        });
    });
});

describe('Courses Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getCourses', () => {
        it('should call GET /courses without params', async () => {
            const mockResponse = {
                success: true,
                data: { courses: [], total: 0, page: 1, limit: 10 },
            };
            mockedApi.get.mockResolvedValue(mockResponse);

            await coursesService.getCourses();

            expect(mockedApi.get).toHaveBeenCalledWith('/courses', undefined);
        });

        it('should call GET /courses with pagination params', async () => {
            const mockResponse = {
                success: true,
                data: { courses: [], total: 0, page: 2, limit: 20 },
            };
            mockedApi.get.mockResolvedValue(mockResponse);

            await coursesService.getCourses({ page: '2', limit: '20' });

            expect(mockedApi.get).toHaveBeenCalledWith('/courses', { page: '2', limit: '20' });
        });

        it('should call GET /courses with search params', async () => {
            const mockResponse = {
                success: true,
                data: { courses: [], total: 0 },
            };
            mockedApi.get.mockResolvedValue(mockResponse);

            await coursesService.getCourses({
                search: 'react',
                category: 'programming',
                level: 'beginner',
            });

            expect(mockedApi.get).toHaveBeenCalledWith('/courses', {
                search: 'react',
                category: 'programming',
                level: 'beginner',
            });
        });
    });

    describe('getCourse', () => {
        it('should call GET /courses/:id', async () => {
            const mockResponse = {
                success: true,
                data: { course: { _id: '123', title: 'Test Course' } },
            };
            mockedApi.get.mockResolvedValue(mockResponse);

            await coursesService.getCourse('123');

            expect(mockedApi.get).toHaveBeenCalledWith('/courses/123');
        });
    });

    describe('enrollCourse', () => {
        it('should call POST /courses/:id/enroll', async () => {
            const mockResponse = {
                success: true,
                data: { message: 'Enrolled successfully' },
            };
            mockedApi.post.mockResolvedValue(mockResponse);

            await coursesService.enrollCourse('course-123');

            expect(mockedApi.post).toHaveBeenCalledWith('/courses/course-123/enroll', {});
        });
    });
});

describe('Health Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('checkHealth', () => {
        it('should call GET /health', async () => {
            const mockResponse = {
                success: true,
                data: { status: 'ok', timestamp: new Date().toISOString() },
            };
            mockedApi.get.mockResolvedValue(mockResponse);

            await healthService.checkHealth();

            expect(mockedApi.get).toHaveBeenCalledWith('/health');
        });
    });

    describe('ping', () => {
        it('should return true when health check succeeds', async () => {
            mockedApi.get.mockResolvedValue({ success: true });

            const result = await healthService.ping();

            expect(result).toBe(true);
        });

        it('should fallback to courses endpoint and return true', async () => {
            mockedApi.get
                .mockRejectedValueOnce(new Error('Health endpoint not found'))
                .mockResolvedValueOnce({ success: true });

            const result = await healthService.ping();

            expect(result).toBe(true);
            expect(mockedApi.get).toHaveBeenCalledTimes(2);
        });

        it('should return false when all endpoints fail', async () => {
            mockedApi.get.mockRejectedValue(new Error('Network error'));

            const result = await healthService.ping();

            expect(result).toBe(false);
        });
    });

    describe('testConnectivity', () => {
        it('should return connectivity result with latency', async () => {
            const mockResponse = {
                success: true,
                data: { status: 'ok', timestamp: new Date().toISOString() },
            };
            mockedApi.get.mockResolvedValue(mockResponse);

            const result = await healthService.testConnectivity();

            expect(result.isConnected).toBe(true);
            expect(result.latencyMs).toBeGreaterThanOrEqual(0);
            expect(result.healthStatus).toEqual({ status: 'ok', timestamp: expect.any(String) });
        });

        it('should return error info when connectivity fails', async () => {
            mockedApi.get.mockRejectedValue(new Error('Connection refused'));

            const result = await healthService.testConnectivity();

            expect(result.isConnected).toBe(false);
            expect(result.error).toBeDefined();
        });
    });
});
