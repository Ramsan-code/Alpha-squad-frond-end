"use client"

import * as React from "react"
import { Zap, Map, Target, CheckCircle2, Circle, Clock, Users, TrendingUp, Sparkles, BookOpen, ArrowRight, Lock, Play } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/components/auth/auth-provider";

const learningPaths = [
    {
        id: 1,
        title: "Senior Frontend Architect",
        description: "Master the complete frontend engineering stack from design systems to infrastructure and performance optimization.",
        progress: 45,
        estimatedTime: "120 hours",
        enrolled: 12500,
        difficulty: "Advanced",
        modules: [
            { name: "Advanced React & Design Patterns", status: "completed", duration: "24h", lessons: 42 },
            { name: "Next.js 15 App Router & Server Components", status: "active", duration: "18h", lessons: 36, currentLesson: 14 },
            { name: "CI/CD & Frontend Infrastructure", status: "pending", duration: "20h", lessons: 28 },
            { name: "System Design for Enterprise Apps", status: "locked", duration: "32h", lessons: 45 },
            { name: "Performance Optimization & Monitoring", status: "locked", duration: "16h", lessons: 22 },
        ],
        skills: ["React", "Next.js", "TypeScript", "AWS", "Docker"],
        color: "accent-vibrant",
        icon: "🏗️",
    },
    {
        id: 2,
        title: "AI Integration Specialist",
        description: "Learn to build and deploy AI-enhanced applications using LLMs, vector databases, and modern ML infrastructure.",
        progress: 15,
        estimatedTime: "80 hours",
        enrolled: 8400,
        difficulty: "Intermediate",
        modules: [
            { name: "Introduction to Prompt Engineering", status: "completed", duration: "8h", lessons: 15 },
            { name: "Integrating OpenAI & Anthropic SDKs", status: "active", duration: "12h", lessons: 20, currentLesson: 5 },
            { name: "Vector Databases: Pinecone & Supabase", status: "pending", duration: "16h", lessons: 24 },
            { name: "Building RAG-based Applications", status: "locked", duration: "24h", lessons: 32 },
        ],
        skills: ["Python", "LangChain", "OpenAI", "Pinecone", "RAG"],
        color: "accent-cyan",
        icon: "🤖",
    },
    {
        id: 3,
        title: "Full-Stack Cloud Engineer",
        description: "Become proficient in designing, deploying, and managing cloud-native applications across major providers.",
        progress: 0,
        estimatedTime: "150 hours",
        enrolled: 15200,
        difficulty: "Advanced",
        modules: [
            { name: "Cloud Fundamentals & Architecture", status: "pending", duration: "20h", lessons: 30 },
            { name: "AWS Services Deep Dive", status: "locked", duration: "40h", lessons: 55 },
            { name: "Kubernetes & Container Orchestration", status: "locked", duration: "35h", lessons: 48 },
            { name: "Infrastructure as Code with Terraform", status: "locked", duration: "25h", lessons: 35 },
        ],
        skills: ["AWS", "GCP", "Kubernetes", "Terraform", "Docker"],
        color: "amber-500",
        icon: "☁️",
    }
];

export default function LearningPathsPage() {
    const { user } = useAuth();

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 mesh-gradient min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-accent-vibrant via-accent-cyan to-white">
                            Learning Paths
                        </h2>
                        <Badge className="bg-accent-vibrant/10 text-accent-vibrant border-accent-vibrant/20">
                            <Sparkles className="h-3 w-3 mr-1" /> AI Curated
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">
                        Personalized career journeys based on your goals, {user?.name?.split(' ')[0] || "Learner"}.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="glass border-white/10">
                        <Map className="mr-2 h-4 w-4" /> Explore All Paths
                    </Button>
                    <Button className="bg-accent-vibrant hover:bg-accent-vibrant/90 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                        <Target className="mr-2 h-4 w-4" /> Set Career Goal
                    </Button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid gap-4 md:grid-cols-4">
                {[
                    { label: "Active Paths", value: "2", icon: Map, color: "text-accent-vibrant" },
                    { label: "Modules Completed", value: "3", icon: CheckCircle2, color: "text-green-500" },
                    { label: "Hours Invested", value: "48h", icon: Clock, color: "text-accent-cyan" },
                    { label: "Global Rank", value: "Top 8%", icon: TrendingUp, color: "text-amber-500" },
                ].map((stat) => (
                    <Card key={stat.label} className="glass border-none">
                        <CardContent className="pt-6 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{stat.label}</p>
                                <p className="text-2xl font-black mt-1">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Learning Paths */}
            <div className="space-y-8">
                {learningPaths.map((path) => (
                    <Card key={path.id} className="glass border-none overflow-hidden group">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="text-4xl">{path.icon}</div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <CardTitle className="text-2xl">{path.title}</CardTitle>
                                            <Badge variant="outline" className={`text-${path.color} border-${path.color}/30 bg-${path.color}/5`}>
                                                {path.difficulty}
                                            </Badge>
                                            {path.progress > 0 && (
                                                <Badge className="bg-green-500/10 text-green-500 border-none">
                                                    <Play className="h-3 w-3 mr-1 fill-current" /> In Progress
                                                </Badge>
                                            )}
                                        </div>
                                        <CardDescription className="max-w-2xl">{path.description}</CardDescription>
                                        <div className="flex items-center gap-4 pt-2 text-[11px] text-muted-foreground">
                                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {path.estimatedTime}</span>
                                            <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {path.enrolled.toLocaleString()} enrolled</span>
                                            <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {path.modules.length} modules</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:text-right shrink-0">
                                    <div className={`text-4xl font-black text-${path.color}`}>{path.progress}%</div>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">Complete</p>
                                    <div className="w-32 mt-2">
                                        <Progress value={path.progress} className="h-2 bg-white/10">
                                            <div className={`h-full rounded-full bg-${path.color}`} style={{ width: `${path.progress}%` }} />
                                        </Progress>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Skills Tags */}
                            <div className="flex items-center gap-2 mb-6 flex-wrap">
                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Skills:</span>
                                {path.skills.map((skill) => (
                                    <Badge key={skill} variant="outline" className="text-[10px] bg-white/5 border-white/10">{skill}</Badge>
                                ))}
                            </div>

                            {/* Modules Timeline */}
                            <div className="relative">
                                <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-white/10" />
                                <div className="space-y-4">
                                    {path.modules.map((module) => (
                                        <div key={module.name} className="relative flex items-start gap-6 pl-10">
                                            <div className={`absolute left-0 top-1 h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all ${module.status === 'completed'
                                                ? 'border-green-500 bg-green-500/10'
                                                : module.status === 'active'
                                                    ? 'border-accent-vibrant bg-accent-vibrant/10 animate-pulse shadow-[0_0_15px_rgba(124,58,237,0.5)]'
                                                    : module.status === 'pending'
                                                        ? 'border-white/20 bg-white/5'
                                                        : 'border-white/10 bg-black'
                                                }`}>
                                                {module.status === 'completed'
                                                    ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                    : module.status === 'active'
                                                        ? <Zap className="h-4 w-4 text-accent-vibrant fill-current" />
                                                        : module.status === 'locked'
                                                            ? <Lock className="h-3 w-3 text-white/30" />
                                                            : <Circle className="h-4 w-4 text-white/20" />
                                                }
                                            </div>
                                            <div className={`flex-1 p-4 rounded-xl border transition-all ${module.status === 'active'
                                                ? 'border-accent-vibrant/30 bg-accent-vibrant/5 shadow-[0_0_20px_rgba(124,58,237,0.1)]'
                                                : module.status === 'locked'
                                                    ? 'border-white/5 bg-white/[0.01] opacity-50'
                                                    : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
                                                } ${module.status !== 'locked' ? 'cursor-pointer' : ''}`}>
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3">
                                                            <h4 className={`font-semibold ${module.status === 'locked' ? 'text-muted-foreground' : 'text-white'}`}>
                                                                {module.name}
                                                            </h4>
                                                            {module.status === 'active' && module.currentLesson && (
                                                                <Badge className="bg-accent-vibrant/20 text-accent-vibrant text-[9px]">
                                                                    Lesson {module.currentLesson}/{module.lessons}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                                                            <span>{module.lessons} lessons</span>
                                                            <span>•</span>
                                                            <span>{module.duration}</span>
                                                        </div>
                                                    </div>
                                                    <div className="shrink-0">
                                                        {module.status === 'completed' && (
                                                            <Badge className="bg-green-500/10 text-green-500 border-none text-[10px]">Completed</Badge>
                                                        )}
                                                        {module.status === 'active' && (
                                                            <Button size="sm" className="bg-accent-vibrant text-white text-[10px] h-8">
                                                                Continue <ArrowRight className="h-3 w-3 ml-1" />
                                                            </Button>
                                                        )}
                                                        {module.status === 'pending' && (
                                                            <Button size="sm" variant="outline" className="text-[10px] h-8 border-white/10">
                                                                Start
                                                            </Button>
                                                        )}
                                                        {module.status === 'locked' && (
                                                            <Badge variant="outline" className="text-[10px] border-white/10 text-muted-foreground">
                                                                <Lock className="h-2.5 w-2.5 mr-1" /> Locked
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
