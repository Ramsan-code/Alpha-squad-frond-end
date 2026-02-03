import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import * as z from "zod";

const forgotPasswordSchema = z.object({
    email: z.string().email(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        forgotPasswordSchema.parse(body);

        // In a real app, you would:
        // 1. Find user by email
        // 2. Generate a reset token
        // 3. Save token to DB with expiry
        // 4. Send email with reset link

        // Simulating AI delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return NextResponse.json(
            { message: "Reset link sent successfully" },
            { status: 200 }
        );
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: "Invalid input", details: error.issues },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
