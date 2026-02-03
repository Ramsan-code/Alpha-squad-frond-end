const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    console.warn("NEXT_PUBLIC_API_URL is not defined in environment variables");
}

type FetchOptions = RequestInit & {
    params?: Record<string, string>;
};

// Generic API Response wrapper matching standard backend formats
export type ApiResponse<T> = {
    success: boolean;
    data: T;
    message?: string;
    errors?: unknown;
};

async function fetcher<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { params, ...init } = options;

    // Handle query parameters
    // Ensure we don't end up with double slashes if endpoint starts with / and API_URL ends with /
    const baseUrl = API_URL?.replace(/\/$/, "") || "";
    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

    const url = new URL(`${baseUrl}${path}`);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, value);
            }
        });
    }

    // Get token from storage for authenticated requests
    const token = typeof window !== "undefined"
        ? (localStorage.getItem("lms_token") || sessionStorage.getItem("lms_token"))
        : null;

    // Default headers
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    // Add custom headers from options
    if (init.headers) {
        Object.entries(init.headers).forEach(([key, value]) => {
            if (typeof value === "string") {
                headers[key] = value;
            }
        });
    }

    // Add Authorization header if token exists
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url.toString(), {
            ...init,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `API Error: ${response.statusText}`);
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("An unexpected error occurred");
    }
}

// REST Methods
export const api = {
    get: <T>(url: string, params?: Record<string, string>) =>
        fetcher<T>(url, { method: "GET", params }),

    post: <T>(url: string, body: unknown) =>
        fetcher<T>(url, { method: "POST", body: JSON.stringify(body) }),

    put: <T>(url: string, body: unknown) =>
        fetcher<T>(url, { method: "PUT", body: JSON.stringify(body) }),

    patch: <T>(url: string, body: unknown) =>
        fetcher<T>(url, { method: "PATCH", body: JSON.stringify(body) }),

    delete: <T>(url: string) =>
        fetcher<T>(url, { method: "DELETE" }),
};
