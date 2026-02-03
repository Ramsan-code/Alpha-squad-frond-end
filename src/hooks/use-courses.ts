"use client"

import { useState, useEffect } from "react";
import { coursesService, Course } from "@/lib/services/courses.service";

interface UseCoursesOptions {
    page?: number;
    limit?: number;
    category?: string;
    level?: string;
    search?: string;
}

export function useCourses(options: UseCoursesOptions = {}) {
    const [courses, setCourses] = useState<Course[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const params = {
                    page: options.page?.toString() || "1",
                    limit: options.limit?.toString() || "10",
                    ...(options.category && { category: options.category }),
                    ...(options.level && { level: options.level }),
                    ...(options.search && { search: options.search }),
                };

                const response = await coursesService.getCourses(params);

                if (response.success && response.data) {
                    setCourses(response.data.courses);
                    setTotal(response.data.total);
                } else {
                    throw new Error(response.message || "Failed to fetch courses");
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Failed to fetch courses";
                setError(errorMessage);
                console.error("Error fetching courses:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, [options.page, options.limit, options.category, options.level, options.search]);

    return { courses, total, isLoading, error };
}
