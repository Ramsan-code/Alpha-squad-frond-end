import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();
        const file = formData.get("file") as File;
        const folder = (formData.get("folder") as string) || "alpha-lms";

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

        // Upload to Cloudinary
        const result = await uploadToCloudinary(base64, folder);

        return NextResponse.json({
            message: "File uploaded successfully",
            url: result.url,
            publicId: result.publicId,
        });
    } catch (error: unknown) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to upload file" },
            { status: 500 }
        );
    }
}
