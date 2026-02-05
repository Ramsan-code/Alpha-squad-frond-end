"use client"

import * as React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteFooter } from "@/components/site-footer";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";

export function AppLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isLoading, isAuthenticated } = useAuth();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Simple role-based protection
    React.useEffect(() => {
        if (!isLoading && mounted) {
            const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/forgot-password");
            const isPublicPage = pathname === "/" || pathname === "/search" || pathname.startsWith("/demo") || isAuthPage;

            if (!isAuthenticated && !isPublicPage) {
                router.push("/login");
            }

            if (isAuthenticated && isAuthPage) {
                const role = user?.role?.trim().toUpperCase();
                if (role === "INSTRUCTOR" || role === "TEACHER") router.push("/teach/dashboard");
                else if (role === "ADMIN") router.push("/admin/dashboard");
                else router.push("/dashboard");
            }
        }
    }, [isAuthenticated, pathname, isLoading, mounted, user, router]);

    if (!mounted || isLoading) {
        return <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="h-8 w-8 border-2 border-accent-vibrant border-t-transparent rounded-full animate-spin" />
        </div>;
    }

    // Hide sidebar on landing, search (for guests), auth and demo pages
    const hideSidebar = pathname === "/" || (!isAuthenticated && pathname === "/search") || pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/forgot-password") || pathname.startsWith("/demo");

    if (hideSidebar) {
        return (
            <div className="flex min-h-screen flex-col">
                <main className="flex-1">{children}</main>
                {pathname === "/" && <SiteFooter />}
            </div>
        );
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <main className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
