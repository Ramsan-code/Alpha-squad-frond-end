"use client"

import * as React from "react"
import { User, UserRole } from "@/types/user"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/services/auth.service"
import { toast } from "sonner"

interface AuthContextType {
    user: User | null;
    role: UserRole | null;
    isAuthenticated: boolean;
    token: string | null;
    login: (email: string, password: string, remember?: boolean) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

const TOKEN_KEY = "lms_token";
const USER_KEY = "lms_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<User | null>(null);
    const [token, setToken] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const router = useRouter();

    // Load user and token from storage on mount
    React.useEffect(() => {
        const storedToken = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string, remember: boolean = false) => {
        try {
            // Call backend API
            const response = await authService.login(email, password);

            if (!response.success || !response.data) {
                throw new Error(response.message || "Login failed");
            }

            const { user: userData, profile: profileData, token: authToken } = response.data;
            const userWithProfile = { ...userData, profile: profileData };

            // Store user and token
            setUser(userWithProfile);
            setToken(authToken);

            const storage = remember ? localStorage : sessionStorage;
            storage.setItem(USER_KEY, JSON.stringify(userWithProfile));
            storage.setItem(TOKEN_KEY, authToken);

            // Show success message
            toast.success(`Welcome back, ${userData.name}!`);

            // Navigate based on role
            const role = userData.role;
            if (role === "INSTRUCTOR") {
                router.push("/teach/dashboard");
            } else if (role === "ADMIN") {
                router.push("/admin/dashboard");
            } else if (role === "PARENT") {
                router.push("/parent/dashboard");
            } else {
                router.push("/dashboard");
            }
        } catch (error: unknown) {
            console.error("Login error:", error);
            const errorMessage = error instanceof Error ? error.message : "Login failed. Please try again.";
            toast.error(errorMessage);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
        toast.info("You have been logged out");
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{
            user,
            role: user?.role || null,
            isAuthenticated: !!user,
            token,
            login,
            logout,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
