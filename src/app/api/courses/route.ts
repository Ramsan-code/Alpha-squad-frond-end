import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { connectDB } from "@/lib/db/mongodb";
import Course from "@/lib/db/models/Course";
import { courseSchema } from "@/schemas";
import { verifyToken } from "@/lib/auth/jwt";

// GET all courses or filter by query params
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const level = searchParams.get("level");
        const status = searchParams.get("status") || "PUBLISHED";
        const search = searchParams.get("search");

        const query: Record<string, unknown> = { status };

        if (category) query.category = category;
        if (level) query.level = level;
        if (search) {
            query.$text = { $search: search };
        }

        const courses = await Course.find(query)
            .populate("instructor", "name avatar")
            .sort({ createdAt: -1 })
            .limit(50);

        return NextResponse.json({ courses });
    } catch (error) {
        console.error("Get courses error:", error);
        return NextResponse.json(
            { error: "Failed to fetch courses" },
            { status: 500 }
        );
    }
}

// POST create new course
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // Verify authentication
        const token = req.cookies.get("auth-token")?.value;
        if (!token) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const payload = verifyToken(token);
        if (!payload || payload.role !== "INSTRUCTOR") {
            return NextResponse.json(
                { error: "Only instructors can create courses" },
                { status: 403 }
            );
        }

        const body = await req.json();
        const validatedData = courseSchema.parse(body);

        const course = await Course.create({
            ...validatedData,
            instructor: payload.userId,
        });

        return NextResponse.json(
            {
                message: "Course created successfully",
                course,
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error("Create course error:", error);

        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: "Invalid input", details: error.issues },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to create course" },
            { status: 500 }
        );
    }
}
