"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, LoginInput } from "@/schemas/auth.schema"
import { useAuth } from "./auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserRole } from "@/types/user"
import { Loader2, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"

export function LoginForm() {
    const { login } = useAuth();
    const [role, setRole] = React.useState<UserRole>("STUDENT");
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
            // Pass the selected role from the tabs to the login function
            await login(data.email, data.password, remember, role);
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
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Log in as</Label>
                    <Tabs defaultValue="STUDENT" onValueChange={(v) => setRole(v as UserRole)} className="w-full">
                        <TabsList className="grid w-full grid-cols-4 bg-white/5 p-1">
                            <TabsTrigger value="STUDENT" className="data-[state=active]:bg-accent-vibrant text-[10px]">Student</TabsTrigger>
                            <TabsTrigger value="INSTRUCTOR" className="data-[state=active]:bg-accent-cyan text-[10px] text-white!">Instructor</TabsTrigger>
                            <TabsTrigger value="PARENT" className="data-[state=active]:bg-pink-500 text-[10px] text-white!">Parent</TabsTrigger>
                            <TabsTrigger value="ADMIN" className="data-[state=active]:bg-amber-500 text-[10px] text-white!">Admin</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                placeholder="name@enterprise.com"
                                className="pl-10 glass border-white/10"
                                {...register("email")}
                            />
                        </div>
                        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="pl-10 glass border-white/10"
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
                        className="w-full bg-accent-vibrant hover:bg-accent-vibrant/90 text-white transition-all font-bold"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
                <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-transparent px-2 text-muted-foreground">Demo Accounts</span>
                    </div>
                </div>
                <div className="text-[10px] text-muted-foreground text-center">
                    Simply enter any email and select a role to test the multi-role redirection.
                </div>
            </CardFooter>
        </Card>
    );
}
