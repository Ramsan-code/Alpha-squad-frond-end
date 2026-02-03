import { z } from "zod";

// User Schemas
export const userRoleSchema = z.enum(["STUDENT", "INSTRUCTOR", "PARENT", "ADMIN"]);

export const userSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: userRoleSchema.default("STUDENT"),
    avatar: z.string().url().optional(),
    bio: z.string().max(500).optional(),
    phone: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export const updateUserSchema = userSchema.partial().omit({ password: true });

// Course Schemas
export const courseLevelSchema = z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]);
export const courseStatusSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const courseSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    thumbnail: z.string().url().optional(),
    price: z.number().min(0, "Price must be positive"),
    level: courseLevelSchema,
    category: z.string().min(2, "Category is required"),
    tags: z.array(z.string()).default([]),
    status: courseStatusSchema.default("DRAFT"),
    duration: z.number().min(1, "Duration must be at least 1 hour").optional(),
});

// Lesson Schemas
export const lessonSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    content: z.string().min(10, "Content is required"),
    videoUrl: z.string().url().optional(),
    duration: z.number().min(1, "Duration must be positive").optional(),
    order: z.number().min(0).default(0),
    resources: z.array(z.object({
        title: z.string(),
        url: z.string().url(),
        type: z.enum(["PDF", "VIDEO", "LINK", "OTHER"]),
    })).default([]),
});

// Assignment Schemas
export const assignmentSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description is required"),
    dueDate: z.string().datetime().optional(),
    maxScore: z.number().min(1).max(100).default(100),
    instructions: z.string().optional(),
});

export const submissionSchema = z.object({
    content: z.string().min(10, "Submission content is required"),
    attachments: z.array(z.string().url()).default([]),
});

// Enrollment Schema
export const enrollmentSchema = z.object({
    courseId: z.string(),
    userId: z.string(),
    progress: z.number().min(0).max(100).default(0),
});

// Review Schema
export const reviewSchema = z.object({
    courseId: z.string(),
    rating: z.number().min(1).max(5),
    comment: z.string().min(10, "Comment must be at least 10 characters"),
});

// Export types
export type UserRole = z.infer<typeof userRoleSchema>;
export type User = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CourseLevel = z.infer<typeof courseLevelSchema>;
export type CourseStatus = z.infer<typeof courseStatusSchema>;
export type Course = z.infer<typeof courseSchema>;
export type Lesson = z.infer<typeof lessonSchema>;
export type Assignment = z.infer<typeof assignmentSchema>;
export type Submission = z.infer<typeof submissionSchema>;
export type Enrollment = z.infer<typeof enrollmentSchema>;
export type Review = z.infer<typeof reviewSchema>;
