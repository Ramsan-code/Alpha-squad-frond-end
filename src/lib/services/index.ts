/**
 * Services Module - Public exports for all API services
 */

export { authService } from './auth.service';
export type { LoginResponse, RegisterResponse, MeResponse } from './auth.service';

export { coursesService } from './courses.service';
export type { Course, CoursesResponse, CourseResponse } from './courses.service';

export { healthService } from './health.service';
export type { HealthStatus, ConnectivityResult } from './health.service';
