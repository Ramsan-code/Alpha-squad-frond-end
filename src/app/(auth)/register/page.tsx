import { Metadata } from "next";
import Link from "next/link";
import { Zap, ArrowLeft, GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
    title: "Join LMS AI - Start Your Learning Journey",
    description: "Create an account on the world's most advanced AI-driven LMS. personalized learning paths for students and powerful tools for instructors.",
    keywords: ["LMS", "Register", "Online Learning", "AI Education", "Skill Upgrading"],
};

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex flex-col bg-black mesh-gradient">
            <div className="p-6">
                <Link href="/">
                    <Button variant="ghost" className="text-muted-foreground hover:text-white">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                    </Button>
                </Link>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-6 -mt-12">
                <div className="mb-8 flex flex-col items-center">
                    <div className="h-12 w-12 rounded-2xl bg-accent-vibrant flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(124,58,237,0.5)]">
                        <Zap className="h-7 w-7 text-white fill-current" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Join LMS<span className="text-accent-vibrant">AI</span></h1>
                    <p className="text-muted-foreground mt-2">Choose your path and start growing today.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
                    <Card className="glass border-white/10 hover:border-accent-vibrant/50 transition-all cursor-pointer group">
                        <CardHeader>
                            <div className="w-10 h-10 rounded-xl bg-accent-vibrant/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <GraduationCap className="h-5 w-5 text-accent-vibrant" />
                            </div>
                            <CardTitle>I&apos;m a Student</CardTitle>
                            <CardDescription>Enroll in courses and track your AI-driven skill growth.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href="/login">
                                <Button className="w-full bg-accent-vibrant hover:bg-accent-vibrant/90 text-white">Register as Student</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="glass border-white/10 hover:border-accent-cyan/50 transition-all cursor-pointer group">
                        <CardHeader>
                            <div className="w-10 h-10 rounded-xl bg-accent-cyan/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <Users className="h-5 w-5 text-accent-cyan" />
                            </div>
                            <CardTitle>I&apos;m an Instructor</CardTitle>
                            <CardDescription>Create courses and monetize your expertise globally.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href="/login">
                                <Button className="w-full bg-accent-cyan hover:bg-accent-cyan/90 text-white">Register as Teacher</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                <p className="mt-8 text-sm text-muted-foreground">
                    Already have an account? <Link href="/login" className="text-accent-vibrant font-bold hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    );
}
