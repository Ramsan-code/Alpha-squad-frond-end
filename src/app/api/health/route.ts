import { jsonResponse } from "@/lib/api/response";

export async function GET() {
    return jsonResponse({
        status: "OK",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        service: "LMS-AI-Backend"
    }, 200, "Health check successful");
}
