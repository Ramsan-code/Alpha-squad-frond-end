// User role types matching backend
export type UserRole = "STUDENT" | "INSTRUCTOR" | "PARENT" | "ADMIN";

// User type matching backend User model
export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    bio?: string;
    createdAt?: string;
    updatedAt?: string;
}
