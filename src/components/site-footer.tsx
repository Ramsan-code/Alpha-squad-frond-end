"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Zap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SiteFooter() {
    return (
        <footer className="w-full border-t border-white/10 bg-background pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 outline-none">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-vibrant text-white">
                                <Zap className="h-5 w-5 fill-current" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-foreground">
                                Alpha.<span className="text-accent-vibrant">LMS</span>
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Empowering the next generation of learners with AI-driven insights and personalized paths.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <Link href="#" className="text-muted-foreground hover:text-accent-vibrant transition-colors">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-accent-vibrant transition-colors">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-accent-vibrant transition-colors">
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-accent-vibrant transition-colors">
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Platform</h3>
                        <ul className="space-y-2.5">
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-accent-vibrant transition-colors">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-accent-vibrant transition-colors">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-accent-vibrant transition-colors">
                                    Enterprise
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-accent-vibrant transition-colors">
                                    Success Stories
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Resources</h3>
                        <ul className="space-y-2.5">
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-accent-vibrant transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-accent-vibrant transition-colors">
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-accent-vibrant transition-colors">
                                    Community
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-accent-vibrant transition-colors">
                                    Help Center
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Stay Updated</h3>
                        <p className="text-sm text-muted-foreground">
                            Subscribe to our newsletter for the latest AI learning trends.
                        </p>
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Enter your email"
                                    type="email"
                                    className="bg-muted/50 border-white/10 focus-visible:ring-accent-vibrant"
                                />
                                <Button size="icon" className="bg-accent-vibrant hover:bg-accent-vibrant/90 text-white shrink-0">
                                    <ArrowRight className="h-4 w-4" />
                                    <span className="sr-only">Subscribe</span>
                                </Button>
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                                By subscribing, you agree to our Privacy Policy.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t border-white/10 pt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} Alpha.LMS Inc. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                            Cookie Settings
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
