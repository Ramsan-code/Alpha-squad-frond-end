"use client"

import * as React from "react"
import { Clock, Play, Search, Star, BookOpen, Filter, Grid, List, Award, ChevronRight, Bookmark, MoreVertical } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/auth/auth-provider";

const enrolledCourses = [
    {
        id: "1",
        title: "Advanced React Patterns & Performance",
        instructor: "Dr. Sarah Chen",
        instructorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
        progress: 68,
        lastAccessed: "2 hours ago",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
        rating: 4.9,
        totalLessons: 42,
        completedLessons: 28,
        duration: "12h 30m",
        category: "Development",
        nextLesson: "Custom Hooks Deep Dive",
        certified: true,
    },
    {
        id: "2",
        title: "Next.js 15 Deep Dive: App Router Mastery",
        instructor: "Lee Robinson",
        instructorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
        progress: 45,
        lastAccessed: "Yesterday",
        image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&auto=format&fit=crop&q=60",
        rating: 4.8,
        totalLessons: 38,
        completedLessons: 17,
        duration: "10h 15m",
        category: "Development",
        nextLesson: "Server Actions in Production",
        certified: true,
    },
    {
        id: "3",
        title: "AI Integration for SaaS Applications",
        instructor: "Anna Kumar",
        instructorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
        progress: 22,
        lastAccessed: "3 days ago",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60",
        rating: 4.95,
        totalLessons: 56,
        completedLessons: 12,
        duration: "18h 45m",
        category: "AI/ML",
        nextLesson: "Building RAG Systems",
        certified: false,
    },
    {
        id: "4",
        title: "Enterprise Cloud Architecture",
        instructor: "Michael Torres",
        instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
        progress: 100,
        lastAccessed: "Last week",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
        rating: 4.7,
        totalLessons: 30,
        completedLessons: 30,
        duration: "8h 20m",
        category: "Cloud",
        nextLesson: null,
        certified: true,
    },
];

export default function MyCoursesPage() {
    const { user } = useAuth();
    const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
    const [filter, setFilter] = React.useState("all");

    const filteredCourses = filter === "all"
        ? enrolledCourses
        : filter === "inProgress"
            ? enrolledCourses.filter(c => c.progress > 0 && c.progress < 100)
            : enrolledCourses.filter(c => c.progress === 100);

    const stats = {
        totalCourses: enrolledCourses.length,
        inProgress: enrolledCourses.filter(c => c.progress > 0 && c.progress < 100).length,
        completed: enrolledCourses.filter(c => c.progress === 100).length,
        totalHours: "49h 50m",
    };

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 mesh-gradient min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-accent-vibrant to-accent-cyan">
                        My Learning Library
                    </h2>
                    <p className="text-muted-foreground">
                        Welcome back, <span className="text-white font-medium">{user?.name || "Learner"}</span>. Continue your journey.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search courses..." className="pl-9 glass border-white/10 h-10" />
                    </div>
                    <Button variant="outline" className="glass border-white/10 h-10">
                        <Filter className="h-4 w-4 mr-2" /> Filter
                    </Button>
                    <div className="flex border border-white/10 rounded-lg overflow-hidden">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`rounded-none h-10 ${viewMode === 'grid' ? 'bg-white/10' : ''}`}
                            onClick={() => setViewMode("grid")}
                        >
                            <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`rounded-none h-10 ${viewMode === 'list' ? 'bg-white/10' : ''}`}
                            onClick={() => setViewMode("list")}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                {[
                    { label: "Total Enrolled", value: stats.totalCourses, icon: BookOpen, color: "text-accent-vibrant" },
                    { label: "In Progress", value: stats.inProgress, icon: Play, color: "text-accent-cyan" },
                    { label: "Completed", value: stats.completed, icon: Award, color: "text-green-500" },
                    { label: "Learning Hours", value: stats.totalHours, icon: Clock, color: "text-amber-500" },
                ].map((stat) => (
                    <Card key={stat.label} className="glass border-none">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{stat.label}</p>
                                    <p className="text-2xl font-black mt-1">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                                    <stat.icon className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filter Tabs */}
            <Tabs defaultValue="all" onValueChange={setFilter} className="w-full">
                <TabsList className="bg-white/5 border border-white/10 p-1">
                    <TabsTrigger value="all" className="text-xs">All Courses</TabsTrigger>
                    <TabsTrigger value="inProgress" className="text-xs">In Progress</TabsTrigger>
                    <TabsTrigger value="completed" className="text-xs">Completed</TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Courses Grid/List */}
            <div className={viewMode === "grid" ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-4"}>
                {filteredCourses.map((course) => (
                    viewMode === "grid" ? (
                        <Card key={course.id} className="glass border-none overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                            <div className="relative h-36 overflow-hidden">
                                <Image
                                    src={course.image}
                                    alt={course.title}
                                    width={400}
                                    height={200}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute top-3 right-3 flex gap-2">
                                    {course.certified && (
                                        <Badge className="bg-amber-500/90 text-black text-[8px] font-bold">
                                            <Award className="h-2.5 w-2.5 mr-1" /> CERTIFIED
                                        </Badge>
                                    )}
                                </div>
                                <div className="absolute top-3 left-3">
                                    <Badge className="bg-black/60 text-white text-[9px] backdrop-blur-sm">{course.category}</Badge>
                                </div>
                                <div className="absolute bottom-3 left-3 right-3">
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src={course.instructorAvatar}
                                            alt={course.instructor}
                                            width={24}
                                            height={24}
                                            className="rounded-full border border-white/20"
                                        />
                                        <span className="text-[10px] text-white/80">{course.instructor}</span>
                                    </div>
                                </div>
                                {course.progress < 100 && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link href={`/courses/${course.id}`}>
                                            <Button className="bg-accent-vibrant hover:bg-accent-vibrant/90 text-white rounded-full shadow-[0_0_20px_rgba(124,58,237,0.5)]">
                                                <Play className="mr-2 h-4 w-4 fill-current" /> Resume
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                            <CardHeader className="pb-2 pt-4">
                                <div className="flex items-start justify-between gap-2">
                                    <CardTitle className="text-sm font-bold leading-tight line-clamp-2">{course.title}</CardTitle>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 shrink-0">
                                        <Bookmark className="h-3.5 w-3.5 text-muted-foreground" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-0">
                                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                    <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                                    <div className="flex items-center gap-1 text-amber-500">
                                        <Star className="h-3 w-3 fill-current" /> {course.rating}
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-[10px]">
                                        <span className="text-muted-foreground">Progress</span>
                                        <span className={`font-bold ${course.progress === 100 ? 'text-green-500' : 'text-white'}`}>{course.progress}%</span>
                                    </div>
                                    <Progress value={course.progress} className="h-1.5 bg-white/10">
                                        <div
                                            className={`h-full transition-all rounded-full ${course.progress === 100 ? 'bg-green-500' : 'bg-accent-vibrant'}`}
                                            style={{ width: `${course.progress}%` }}
                                        />
                                    </Progress>
                                </div>
                                {course.nextLesson && (
                                    <div className="pt-2 border-t border-white/5">
                                        <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Up Next</p>
                                        <p className="text-[11px] text-white truncate mt-0.5">{course.nextLesson}</p>
                                    </div>
                                )}
                                {course.progress === 100 && (
                                    <div className="pt-2 border-t border-white/5">
                                        <Button className="w-full bg-green-500/10 text-green-500 hover:bg-green-500/20 text-[10px] h-8">
                                            <Award className="h-3 w-3 mr-1" /> View Certificate
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <Card key={course.id} className="glass border-none overflow-hidden group hover:bg-white/[0.03] transition-all">
                            <div className="flex items-center gap-6 p-4">
                                <div className="relative w-32 h-20 rounded-lg overflow-hidden shrink-0">
                                    <Image
                                        src={course.image}
                                        alt={course.title}
                                        fill
                                        className="object-cover"
                                    />
                                    {course.progress < 100 && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play className="h-6 w-6 text-white fill-current" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge className="bg-white/5 text-[9px]">{course.category}</Badge>
                                        {course.certified && <Badge className="bg-amber-500/20 text-amber-500 text-[8px]">CERTIFIED</Badge>}
                                    </div>
                                    <h3 className="font-bold text-sm truncate">{course.title}</h3>
                                    <p className="text-[11px] text-muted-foreground">{course.instructor} • {course.duration}</p>
                                </div>
                                <div className="w-32 shrink-0">
                                    <div className="flex justify-between text-[10px] mb-1">
                                        <span className="text-muted-foreground">{course.completedLessons}/{course.totalLessons}</span>
                                        <span className="font-bold">{course.progress}%</span>
                                    </div>
                                    <Progress value={course.progress} className="h-1.5 bg-white/10">
                                        <div className={`h-full rounded-full ${course.progress === 100 ? 'bg-green-500' : 'bg-accent-vibrant'}`} style={{ width: `${course.progress}%` }} />
                                    </Progress>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Link href={`/courses/${course.id}`}>
                                        <Button size="sm" className={course.progress === 100 ? "bg-green-500/10 text-green-500" : "bg-accent-vibrant"}>
                                            {course.progress === 100 ? "Review" : "Continue"} <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </Link>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )
                ))}
            </div>
        </div>
    )
}
