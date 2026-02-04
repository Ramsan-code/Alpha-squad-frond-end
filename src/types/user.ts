// User role types matching backend
export type UserRole = "STUDENT" | "INSTRUCTOR" | "PARENT" | "ADMIN";

import { UserProfile } from "./profile";

// User type matching backend User model
export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    bio?: string;
    profile?: UserProfile; // Role-specific profile data (Student or Teacher)
    createdAt?: string;
    updatedAt?: string;
}
