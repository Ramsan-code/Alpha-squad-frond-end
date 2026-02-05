"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Zap, Menu, X, ChevronDown, GraduationCap, Users, ShieldCheck, BookOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export function Navbar() {
    const pathname = usePathname()
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Do not render navbar on dashboard or auth pages if they have their own layout (optional check)
    // For now, we assume this is used in the Marketing layout

    const features = [
        {
            title: "For Students",
            description: "Personalized AI learning paths",
            href: "/register/student",
            icon: GraduationCap,
            color: "text-accent-vibrant",
        },
        {
            title: "For Instructors",
            description: "Create and monetize courses",
            href: "/register/teacher",
            icon: Users,
            color: "text-accent-cyan",
        },
        {
            title: "Start Learning",
            description: "Browse our course catalog",
            href: "/login", // Placeholder
            icon: BookOpen,
            color: "text-green-500",
        },
        {
            title: "Enterprise",
            description: "Scale training globally",
            href: "/compliance", // Placeholder
            icon: ShieldCheck,
            color: "text-amber-500",
        },
    ]

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-black/50 backdrop-blur-lg border-b border-white/10 py-3"
                    : "bg-transparent py-5"
            )}
        >
            <div className="max-w-7xl mx-auto px-6 h-10 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="h-8 w-8 rounded-xl bg-accent-vibrant flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.3)] group-hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] transition-all">
                        <Zap className="h-5 w-5 text-white fill-current" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">
                        Alpha.<span className="text-accent-vibrant">LMS</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="text-base font-medium text-muted-foreground hover:text-white"
                            >
                                Features <ChevronDown className="ml-1 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="center"
                            className="w-[300px] glass border-white/10 p-2"
                        >
                            <div className="grid gap-2">
                                {features.map((feature, index) => (
                                    <DropdownMenuItem key={index} asChild>
                                        <Link
                                            href={feature.href}
                                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer group"
                                        >
                                            <div className={`mt-1 h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center ${feature.color} group-hover:scale-110 transition-transform`}>
                                                <feature.icon className="h-4 w-4" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-medium text-white leading-none">
                                                    {feature.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground line-clamp-1">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Link
                        href="/coming-soon"
                        className="text-sm font-medium text-muted-foreground hover:text-white transition-colors"
                    >
                        Demo
                    </Link>
                    <Link
                        href="/coming-soon"
                        className="text-sm font-medium text-muted-foreground hover:text-white transition-colors"
                    >
                        Pricing
                    </Link>
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost" className="text-muted-foreground hover:text-white">
                            Sign In
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button className="bg-accent-vibrant hover:bg-accent-vibrant/90 text-white rounded-full px-6 shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all">
                            Sign Up
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] glass border-l border-white/10 bg-black/95">
                            <div className="flex flex-col gap-8 mt-8">
                                <Link href="/" className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-xl bg-accent-vibrant flex items-center justify-center">
                                        <Zap className="h-5 w-5 text-white fill-current" />
                                    </div>
                                    <span className="text-xl font-bold">Alpha.LMS</span>
                                </Link>

                                <div className="flex flex-col gap-4">
                                    <div className="font-semibold text-lg text-white/50 px-2">Features</div>
                                    {features.map((feature, index) => (
                                        <Link
                                            key={index}
                                            href={feature.href}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5"
                                        >
                                            <feature.icon className={`h-5 w-5 ${feature.color}`} />
                                            <span className="font-medium">{feature.title}</span>
                                        </Link>
                                    ))}
                                </div>

                                <div className="h-px bg-white/10" />

                                <div className="flex flex-col gap-4">
                                    <Link href="/login">
                                        <Button variant="outline" className="w-full justify-start border-white/10 hover:bg-white/5">
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button className="w-full justify-start bg-accent-vibrant hover:bg-accent-vibrant/90">
                                            Sign Up
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
