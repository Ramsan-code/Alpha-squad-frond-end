import { api, ApiResponse } from "@/lib/api";
import { User } from "@/types/user";
import { UserProfile } from "@/types/profile";

// DTO types matching backend response structure
export type LoginResponse = ApiResponse<{
    user: User;
    profile: UserProfile;
    token: string;
}>;

export type RegisterResponse = ApiResponse<{
    user: User;
    profile: UserProfile;
    token: string;
}>;

export type MeResponse = ApiResponse<{
    user: User;
    profile: UserProfile;
}>;

// Auth service - all backend communication for authentication
export const authService = {
    /**
     * Login user with email and password
     */
    async login(email: string, password: string): Promise<LoginResponse> {
        return api.post<LoginResponse>("/auth/login", {
            email,
            password,
        });
    },

    /**
     * Register a new student
     */
    async registerStudent(
        email: string,
        password: string,
        firstName: string,
        lastName: string
    ): Promise<RegisterResponse> {
        return api.post<RegisterResponse>("/auth/register/student", {
            email,
            password,
            firstName,
            lastName
        });
    },

    /**
     * Register a new teacher
     */
    async registerTeacher(
        email: string,
        password: string,
        firstName: string,
        lastName: string
    ): Promise<RegisterResponse> {
        return api.post<RegisterResponse>("/auth/register/teacher", {
            email,
            password,
            firstName,
            lastName
        });
    },

    /**
     * Register a new review user
     */
    async registerReview(
        email: string,
        password: string,
        name?: string
    ): Promise<RegisterResponse> {
        return api.post<RegisterResponse>("/auth/register/review", {
            email,
            password,
            name,
        });
    },

    /**
     * Get current user profile (requires auth token)
     */
    async getMe(): Promise<MeResponse> {
        return api.get<MeResponse>("/auth/me");
    },
};
