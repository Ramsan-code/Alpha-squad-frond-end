import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import { userSchema } from "@/schemas";
import { generateToken } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const validatedData = userSchema.parse(body);

        // Check if user already exists
        const existingUser = await User.findOne({ email: validatedData.email });

        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 409 }
            );
        }

        // Create new user
        const user = await User.create({
            name: validatedData.name,
            email: validatedData.email,
            password: validatedData.password,
            role: validatedData.role || "STUDENT",
            avatar: validatedData.avatar,
            bio: validatedData.bio,
            phone: validatedData.phone,
        });

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
                message: "Registration successful",
                user: userData,
                token,
            },
            { status: 201 }
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
        console.error("Registration error:", error);

        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: "Invalid input", details: error.issues },
                { status: 400 }
            );
        }

        if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
