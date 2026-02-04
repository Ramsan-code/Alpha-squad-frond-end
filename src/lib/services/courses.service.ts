import { api, ApiResponse } from "@/lib/api";

// Course DTOs matching backend
export interface Course {
    _id: string;
    title: string;
    description: string;
    instructor: {
        _id: string;
        name: string;
        email: string;
    };
    category: string;
    level: "beginner" | "intermediate" | "advanced";
    price: number;
    duration: number;
    thumbnail?: string;
    isPublished: boolean;
    enrollmentCount: number;
    rating: number;
    createdAt: string;
    updatedAt: string;
}

export type CoursesResponse = ApiResponse<{
    courses: Course[];
    total: number;
    page: number;
    limit: number;
}>;

export type CourseResponse = ApiResponse<{
    course: Course;
}>;

// Courses service - all backend communication for courses
export const coursesService = {
    /**
     * Get all courses with optional filters
     */
    async getCourses(params?: {
        page?: string;
        limit?: string;
        category?: string;
        level?: string;
        search?: string;
    }): Promise<CoursesResponse> {
        return api.get<CoursesResponse>("/courses", params);
    },

    /**
     * Get a single course by ID
     */
    async getCourse(id: string): Promise<CourseResponse> {
        return api.get<CourseResponse>(`/courses/${id}`);
    },

    /**
     * Enroll in a course (requires authentication)
     */
    async enrollCourse(courseId: string): Promise<ApiResponse<{ message: string }>> {
        return api.post<ApiResponse<{ message: string }>>(`/courses/${courseId}/enroll`, {});
    },
};
