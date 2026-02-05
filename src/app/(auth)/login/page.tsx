import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";
import { Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | LMS AI - Access Your Workspace",
    description: "Secure login to your AI-driven LMS dashboard. Access your courses, track your progress, and continue your learning journey.",
};

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col bg-black mesh-gradient">
            {/* Premium Floating Back Button */}
            <div className="fixed top-8 left-8 z-50">
                <Link
                    href="/"
                    className="group flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/5 text-muted-foreground hover:text-white hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                >
                    <div className="h-6 w-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent-vibrant/20 group-hover:text-accent-vibrant transition-colors">
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                    </div>
                    <span className="text-sm font-medium tracking-wide">Back to Home</span>
                </Link>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-6 -mt-12">
                <div className="mb-8 flex flex-col items-center">
                    <div className="h-12 w-12 rounded-2xl bg-accent-vibrant flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(124,58,237,0.5)]">
                        <Zap className="h-7 w-7 text-white fill-current" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">LMS<span className="text-accent-vibrant">AI</span></h1>
                </div>
                <LoginForm />
            </div>
        </div>
    );
}
