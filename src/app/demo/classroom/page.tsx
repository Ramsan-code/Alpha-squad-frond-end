"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { ArrowLeft, Users, Monitor, BookOpen, Zap, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ClassroomDemo() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    const rotateX = useTransform(scrollYProgress, [0, 1], [0, 45])
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 0.8])
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 1, 0])

    return (
        <div ref={containerRef} className="min-h-[300vh] bg-black text-white selection:bg-accent-vibrant selection:text-white">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center glass border-b border-white/5">
                <Link href="/">
                    <Button variant="ghost" className="text-muted-foreground hover:text-white">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Exit Demo
                    </Button>
                </Link>
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-accent-vibrant flex items-center justify-center">
                        <Zap className="h-5 w-5 text-white fill-current" />
                    </div>
                    <span className="font-bold tracking-tight">Alpha.<span className="text-accent-vibrant">LMS</span> 3D</span>
                </div>
                <Button className="bg-accent-vibrant text-white rounded-full font-bold">Try for Free</Button>
            </nav>

            {/* Hero Section */}
            <section className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
                <motion.div
                    style={{ opacity }}
                    className="text-center space-y-4 mb-20 z-10"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="px-4 py-1 rounded-full bg-accent-vibrant/10 text-accent-vibrant text-xs font-bold tracking-widest uppercase border border-accent-vibrant/20">
                            Experience the Future
                        </span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-6xl md:text-8xl font-black tracking-tighter"
                    >
                        THE 3D <span className="text-stroke text-transparent">CLASSROOM</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-muted-foreground text-xl max-w-xl mx-auto"
                    >
                        Scroll to enter a deep-immersion learning environment powered by AI.
                    </motion.p>
                </motion.div>

                {/* 3D Scene */}
                <div className="relative w-full max-w-5xl aspect-video perspective-2000">
                    <motion.div
                        style={{ rotateX, scale }}
                        className="relative w-full h-full preserve-3d transition-all duration-700 ease-out"
                    >
                        {/* Floor */}
                        <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent rounded-[40px] border border-white/20 transform rotateX-90 origin-bottom" />

                        {/* Main Stage */}
                        <div className="absolute inset-0 glass rounded-[40px] border-2 border-white/10 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-accent-vibrant/20 to-transparent" />

                            {/* AI Avatar Spot */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="z-10 flex flex-col items-center"
                            >
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent-vibrant to-accent-cyan p-1 shadow-[0_0_50px_rgba(124,58,237,0.5)]">
                                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                                        <Sparkles className="h-12 w-12 text-accent-vibrant" />
                                    </div>
                                </div>
                                <div className="mt-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 flex flex-col items-center">
                                    <span className="text-sm font-bold text-accent-vibrant underline">AI TUTOR ALINA</span>
                                    <span className="text-[10px] text-muted-foreground">REAL-TIME ANALYSIS ACTIVE</span>
                                </div>
                            </motion.div>

                            {/* Floating UI Cards */}
                            <motion.div
                                animate={{ x: [0, 30, 0], y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                                className="absolute left-10 top-1/4 glass p-4 rounded-xl border border-white/20 w-48 rotate-[-12deg]"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="h-4 w-4 text-accent-cyan" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Peers</span>
                                </div>
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border border-black bg-zinc-800" />
                                    ))}
                                    <div className="w-8 h-8 rounded-full border border-black bg-accent-vibrant flex items-center justify-center text-[10px] font-bold">+12</div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ x: [0, -40, 0], y: [0, 20, 0] }}
                                transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
                                className="absolute right-10 bottom-1/4 glass p-4 rounded-xl border border-white/20 w-56 rotate-[8deg]"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <BookOpen className="h-4 w-4 text-amber-500" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Topic Index</span>
                                </div>
                                <div className="space-y-1.5 font-medium text-xs">
                                    <div className="p-1.5 rounded-lg bg-white/10 text-white">Quantum Computing</div>
                                    <div className="p-1.5 rounded-lg text-muted-foreground">Encryption Math</div>
                                    <div className="p-1.5 rounded-lg text-muted-foreground">Qubits Logic</div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Feature Reveal 1 */}
            <section className="h-screen flex items-center justify-center px-6">
                <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="w-12 h-12 rounded-xl bg-accent-vibrant/20 flex items-center justify-center">
                            <Monitor className="h-6 w-6 text-accent-vibrant" />
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight">Immersive 3D Layouts</h2>
                        <p className="text-muted-foreground text-lg italic">
                            &quot;Traditional video players are static. Our 3D classroom puts you inside the educational space with spatial UI that reacts to your gaze and interaction.&quot;
                        </p>
                    </div>
                    <div className="aspect-square glass rounded-3xl border border-white/10 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-vibrant/20 to-accent-cyan/20 opacity-50" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="w-1/2 h-1/2 bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/30 shadow-2xl flex items-center justify-center"
                            >
                                <Sparkles className="h-12 w-12 text-white" />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="h-screen flex flex-col items-center justify-center text-center px-6">
                <h2 className="text-5xl md:text-7xl font-bold mb-8">Ready to evolve?</h2>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link href="/register">
                        <Button size="lg" className="h-16 px-10 bg-white text-black hover:bg-zinc-200 rounded-full text-xl font-black">
                            JOIN ALPHA.LMS NOW
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button variant="outline" size="lg" className="h-16 px-10 glass rounded-full text-xl font-bold border-white/20">
                            LEARN MORE
                        </Button>
                    </Link>
                </div>
            </section>

            <style jsx global>{`
                .perspective-2000 {
                    perspective: 2000px;
                }
                .preserve-3d {
                    transform-style: preserve-3d;
                }
                .text-stroke {
                    -webkit-text-stroke: 1px white;
                }
            `}</style>
        </div>
    )
}
