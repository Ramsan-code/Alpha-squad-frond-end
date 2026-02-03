"use client"

import * as React from "react"
import { User, UserRole } from "@/types/user"
import { useRouter } from "next/navigation"

interface AuthContextType {
    user: User | null;
    role: UserRole | null;
    isAuthenticated: boolean;
    login: (email: string, password: string, remember?: boolean, roleHint?: UserRole) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<User | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const router = useRouter();

    // Load user from storage on mount
    React.useEffect(() => {
        const storedUser = localStorage.getItem("lms_user") || sessionStorage.getItem("lms_user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string, remember: boolean = false, roleHint?: UserRole) => {
        // We don't set global isLoading=true here to avoid unmounting the whole app/login form
        // The LoginForm will handle its own local loading state for the button

        try {
            // First try real API
            let userData;
            try {
                const response = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    userData = data.user;
                }
            } catch (apiErr) {
                console.warn("API login failed, falling back to persona data", apiErr);
            }

            // Fallback to "Real" User Personas if API fails or for demo purposes
            if (!userData) {
                // Use roleHint from LoginForm, or infer from email as fallback
                const role: UserRole = roleHint || (
                    email.includes("instructor") || email.includes("teacher") ? "INSTRUCTOR" :
                        email.includes("parent") ? "PARENT" :
                            email.includes("admin") ? "ADMIN" : "STUDENT"
                );

                const userPersonas: Record<UserRole, Partial<User>> = {
                    STUDENT: {
                        name: "Alex Rivera",
                        bio: "Full-stack developer looking to master AI integration.",
                        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60"
                    },
                    INSTRUCTOR: {
                        name: "Dr. Sarah Chen",
                        bio: "Lead Instructor with 15+ years of industry experience in Cloud Architecture.",
                        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60"
                    },
                    ADMIN: {
                        name: "Mark Johnson",
                        bio: "Systems Administrator and Compliance Officer.",
                        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60"
                    },
                    PARENT: {
                        name: "Linda Rivera",
                        bio: "Parent of Alex Rivera. Monitoring educational progress.",
                        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60"
                    }
                };

                const persona = userPersonas[role];
                userData = {
                    id: role === "STUDENT" ? "stu_01" : role === "INSTRUCTOR" ? "ins_01" : role === "ADMIN" ? "adm_01" : "par_01",
                    name: persona.name || email.split("@")[0],
                    email: email,
                    role: role,
                    avatar: persona.avatar,
                    bio: persona.bio,
                };
            }

            setUser(userData);
            const storage = remember ? localStorage : sessionStorage;
            storage.setItem("lms_user", JSON.stringify(userData));

            // Navigation happens smoothly via router.push
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
            console.error("Login fatal error:", error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("lms_user");
        sessionStorage.removeItem("lms_user");
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{
            user,
            role: user?.role || null,
            isAuthenticated: !!user,
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
