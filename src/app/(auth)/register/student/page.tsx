"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, GraduationCap, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/lib/services/auth.service";

const registerSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function StudentRegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        try {
            const response = await authService.registerStudent(
                data.email,
                data.password,
                data.firstName,
                data.lastName
            );

            if (response.success) {
                toast.success("Registration successful!", {
                    description: "Your account is pending admin approval. You can login once approved.",
                });
                router.push("/login");
            }
        } catch (error: any) {
            console.error("Registration error:", error);
            toast.error(error.message || "Something went wrong during registration");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-black mesh-gradient">
            <div className="p-6">
                <Link href="/register">
                    <Button variant="ghost" className="text-muted-foreground hover:text-white">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Role Selection
                    </Button>
                </Link>
            </div>

            <div className="flex-1 flex items-center justify-center p-6 -mt-12">
                <Card className="w-full max-w-md glass border-white/10">
                    <CardHeader className="space-y-1">
                        <div className="w-12 h-12 rounded-xl bg-accent-vibrant/20 flex items-center justify-center mb-4">
                            <GraduationCap className="h-6 w-6 text-accent-vibrant" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Student Registration</CardTitle>
                        <CardDescription>
                            Create your account to start your learning journey
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        placeholder="John"
                                        className="bg-white/5 border-white/10"
                                        {...register("firstName")}
                                    />
                                    {errors.firstName && (
                                        <p className="text-xs text-red-500">{errors.firstName.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        placeholder="Doe"
                                        className="bg-white/5 border-white/10"
                                        {...register("lastName")}
                                    />
                                    {errors.lastName && (
                                        <p className="text-xs text-red-500">{errors.lastName.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    className="bg-white/5 border-white/10"
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-white/5 border-white/10"
                                    {...register("password")}
                                />
                                {errors.password && (
                                    <p className="text-xs text-red-500">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-white/5 border-white/10"
                                    {...register("confirmPassword")}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-accent-vibrant hover:bg-accent-vibrant/90 text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...
                                    </>
                                ) : (
                                    "Create Student Account"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/login" className="text-accent-vibrant hover:underline font-bold">
                                Sign In
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
