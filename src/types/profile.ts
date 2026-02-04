import { Course } from "@/lib/services/courses.service";

export interface StudentProfile {
    _id: string;
    userId: string;
    firstName: string;
    lastName: string;
    enrolledCourses: {
        courseId: Course;
        progress: number;
        lastAccessed: string;
    }[];
}

export interface TeacherProfile {
    _id: string;
    userId: string;
    firstName: string;
    lastName: string;
    coursesCreated: Course[];
}

export type UserProfile = StudentProfile | TeacherProfile | Record<string, unknown>;

export function isStudentProfile(profile: UserProfile | undefined): profile is StudentProfile {
    return !!profile && 'enrolledCourses' in profile;
}

export function isTeacherProfile(profile: UserProfile | undefined): profile is TeacherProfile {
    return !!profile && 'coursesCreated' in profile;
}
