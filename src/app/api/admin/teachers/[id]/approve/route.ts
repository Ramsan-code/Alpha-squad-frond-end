import { NextRequest } from "next/server";
import { jsonResponse, errorResponse } from "@/lib/api/response";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    // Mock admin check
    const isAdmin = true;
    if (!isAdmin) return errorResponse("Admin privileges required", 403);

    return jsonResponse({ id, status: "APPROVED" }, 200, `Teacher ${id} approved`);
}
