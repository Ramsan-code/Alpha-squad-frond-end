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
            <div className="p-6">
                <Button variant="ghost" className="text-muted-foreground hover:text-white" asChild>
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                    </Link>
                </Button>
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
