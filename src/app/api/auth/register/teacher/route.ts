import { NextRequest } from "next/server";
import { jsonResponse, errorResponse } from "@/lib/api/response";
import { registerSchema } from "@/schemas/auth.schema";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validated = registerSchema.safeParse({ ...body, role: "INSTRUCTOR" });

        if (!validated.success) {
            return errorResponse("Validation failed", 400, validated.error.format());
        }

        // Mock registration logic
        const newUser = {
            id: Math.random().toString(36).substring(7),
            ...validated.data,
            role: "INSTRUCTOR",
            createdAt: new Date().toISOString()
        };

        return jsonResponse(newUser, 201, "Teacher registered successfully");
    } catch {
        return errorResponse("Internal server error", 500);
    }
}
