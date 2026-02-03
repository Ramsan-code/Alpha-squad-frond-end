export type UserRole = "STUDENT" | "INSTRUCTOR" | "ADMIN" | "PARENT";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    bio?: string;
    enrolledCourses?: string[];
    createdCourses?: string[];
    permissions?: string[];
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}
