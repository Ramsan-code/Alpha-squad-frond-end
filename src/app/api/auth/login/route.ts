import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import { loginSchema } from "@/schemas";
import { generateToken } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const validatedData = loginSchema.parse(body);

        // Find user with password field
        const user = await User.findOne({ email: validatedData.email }).select("+password");

        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(validatedData.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });

        // Create response with user data (excluding password)
        const userData = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            bio: user.bio,
        };

        const response = NextResponse.json(
            {
                message: "Login successful",
                user: userData,
                token,
            },
            { status: 200 }
        );

        // Set HTTP-only cookie
        response.cookies.set("auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return response;
    } catch (error: unknown) {
        console.error("Login error:", error);

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
