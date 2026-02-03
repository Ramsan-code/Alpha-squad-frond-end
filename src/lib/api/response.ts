import { NextResponse } from "next/server";

export type ApiResponse<T = unknown> = {
    success: boolean;
    message?: string;
    data?: T;
    errors?: unknown;
};

export const jsonResponse = <T>(
    data: T,
    status: number = 200,
    message?: string
) => {
    return NextResponse.json(
        {
            success: true,
            message,
            data,
        },
        { status }
    );
};

export const errorResponse = (
    message: string,
    status: number = 400,
    errors?: unknown
) => {
    return NextResponse.json(
        {
            success: false,
            message,
            errors,
        },
        { status }
    );
};
