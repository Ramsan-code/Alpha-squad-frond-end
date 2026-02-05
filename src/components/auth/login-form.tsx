"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, LoginInput } from "@/schemas"
import { useAuth } from "./auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail, Lock, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"


export function LoginForm() {
    const { login } = useAuth();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [remember, setRemember] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginInput) => {
        setIsSubmitting(true);
        try {
            await login(data.email, data.password, remember);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-md glass border-white/10 shadow-2xl">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
                <CardDescription className="text-center">
                    Enter your credentials to access your account
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2 text-white/70">
                            <Mail className="h-3 w-3" /> Email Address
                        </Label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-accent-vibrant transition-colors" />
                            <Input
                                id="email"
                                placeholder="name@enterprise.com"
                                className="pl-10 glass border-white/10 focus:border-accent-vibrant/50 transition-all"
                                {...register("email")}
                            />
                        </div>
                        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="flex items-center gap-2 text-white/70">
                            <Lock className="h-3 w-3" /> Password
                        </Label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-accent-vibrant transition-colors" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="pl-10 glass border-white/10 focus:border-accent-vibrant/50 transition-all"
                                {...register("password")}
                            />
                        </div>
                        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                checked={remember}
                                onCheckedChange={(v) => setRemember(v as boolean)}
                                className="border-white/20 data-[state=checked]:bg-accent-vibrant data-[state=checked]:border-accent-vibrant"
                            />
                            <Label htmlFor="remember" className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-muted-foreground hover:text-white transition-colors">
                                Remember me
                            </Label>
                        </div>
                        <Link
                            href="/forgot-password"
                            className="text-xs font-medium text-accent-vibrant hover:underline transition-all"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-accent-vibrant hover:bg-accent-vibrant/90 text-white transition-all font-bold group"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <CheckCircle2 className="mr-2 h-4 w-4 opacity-0 group-hover:opacity-100 -ml-2 transition-all" />
                                <span>Sign In to Account</span>
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="font-semibold text-accent-vibrant hover:underline hover:text-accent-vibrant/80 transition-colors">
                        Create one
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}
