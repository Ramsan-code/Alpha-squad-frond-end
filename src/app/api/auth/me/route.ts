import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";

export async function GET(req: NextRequest) {
    try {
        // Get token from cookie or Authorization header
        const token = req.cookies.get("auth-token")?.value ||
            req.headers.get("authorization")?.replace("Bearer ", "");

        if (!token) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        // Verify token
        const payload = verifyToken(token);

        if (!payload) {
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 401 }
            );
        }

        // Connect to database and fetch user
        await connectDB();
        const user = await User.findById(payload.userId).select("-password");

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                bio: user.bio,
            },
        });
    } catch (error) {
        console.error("Get user error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
