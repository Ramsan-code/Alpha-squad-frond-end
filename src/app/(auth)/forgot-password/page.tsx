"use client"

import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, ArrowLeft, Mail, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const forgotPasswordSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
})

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)


    const form = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    })

    async function onSubmit(values: ForgotPasswordValues) {
        setIsLoading(true)
        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })

            if (!response.ok) {
                throw new Error("Something went wrong. Please try again.")
            }

            setIsSubmitted(true)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-black p-4 selection:bg-accent-vibrant selection:text-white">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent-vibrant/10 blur-[120px] rounded-full opacity-50 -z-10" />

            <Card className="w-full max-w-md glass border-white/10 shadow-2xl overflow-hidden scale-in">
                <CardHeader className="space-y-2 text-center pt-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-accent-vibrant/20 flex items-center justify-center">
                            <Mail className="h-6 w-6 text-accent-vibrant" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight">Forgot password?</CardTitle>
                    <CardDescription className="text-muted-foreground text-base">
                        {isSubmitted
                            ? "We've sent a password reset link to your email."
                            : "Enter your email address and we'll send you a link to reset your password."
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                    {isSubmitted ? (
                        <div className="flex flex-col items-center justify-center py-6 space-y-4 fade-in">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                                <CheckCircle2 className="h-8 w-8 text-green-500" />
                            </div>
                            <p className="text-center text-sm text-muted-foreground max-w-[280px]">
                                If an account exists for that email, you will receive a password reset link shortly.
                            </p>
                        </div>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">Email Address</FormLabel>
                                            <FormControl>
                                                <div className="relative group">
                                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-accent-vibrant transition-colors" />
                                                    <Input
                                                        placeholder="name@example.com"
                                                        className="pl-10 h-10 bg-white/5 border-white/10 focus:border-accent-vibrant transition-all"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    className="w-full h-11 bg-accent-vibrant hover:bg-accent-vibrant/90 text-white font-bold rounded-xl transition-all hover:scale-[1.02]"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending Link...
                                        </>
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    )}
                </CardContent>
                <CardFooter className="bg-white/[0.02] border-t border-white/5 py-6 px-8 flex justify-center">
                    <Link
                        href="/login"
                        className="flex items-center text-sm font-medium text-muted-foreground hover:text-accent-vibrant transition-colors group"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back to login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
