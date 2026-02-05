"use client"

import * as React from "react"
import { Clock, Play, Search, Star, BookOpen, Filter, Grid, List, Award, ChevronRight, Bookmark, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/auth/auth-provider";
import { isStudentProfile } from "@/types/profile";

// No mock data needed anymore, using real data from useAuth()

export default function MyCoursesPage() {
    const { user } = useAuth();
    const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
    const [filter, setFilter] = React.useState("all");
    const [searchTerm, setSearchTerm] = React.useState("");

    // Map backend enrolled courses to UI format
    const courses = React.useMemo(() => {
        // ADMIN PREVIEW: Inject Mock Data
        if (user?.role?.trim().toUpperCase() === 'ADMIN') {
            return [
                {
                    id: "mock-1",
                    title: "Advanced React Patterns",
                    instructor: "Sarah Drasner",
                    instructorAvatar: "https://ui-avatars.com/api/?name=SD&background=random",
                    progress: 65,
                    lastAccessed: new Date().toLocaleDateString(),
                    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
                    rating: 4.8,
                    totalLessons: 45,
                    completedLessons: 29,
                    duration: "12h",
                    category: "Frontend",
                    nextLesson: "Compound Components",
                    certified: false,
                },
                {
                    id: "mock-2",
                    title: "System Design for Scale",
                    instructor: "Alex Xu",
                    instructorAvatar: "https://ui-avatars.com/api/?name=AX&background=random",
                    progress: 42,
                    lastAccessed: new Date(Date.now() - 86400000).toLocaleDateString(),
                    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60",
                    rating: 4.9,
                    totalLessons: 60,
                    completedLessons: 25,
                    duration: "15h",
                    category: "Backend",
                    nextLesson: "Load Balancing Strategy",
                    certified: false,
                },
                {
                    id: "mock-3",
                    title: "Introduction to Generative AI",
                    instructor: "Andrew Ng",
                    instructorAvatar: "https://ui-avatars.com/api/?name=AN&background=random",
                    progress: 100,
                    lastAccessed: "1/15/2026",
                    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60",
                    rating: 5.0,
                    totalLessons: 20,
                    completedLessons: 20,
                    duration: "6h",
                    category: "AI/ML",
                    nextLesson: null,
                    certified: true,
                },
                {
                    id: "mock-4",
                    title: "UI/UX Principles 2026",
                    instructor: "Gary Vaynerchuk",
                    instructorAvatar: "https://ui-avatars.com/api/?name=GV&background=random",
                    progress: 0,
                    lastAccessed: "Never",
                    image: "https://images.unsplash.com/photo-1586717791821-3f44a5638d4f?w=800&auto=format&fit=crop&q=60",
                    rating: 4.7,
                    totalLessons: 35,
                    completedLessons: 0,
                    duration: "10h",
                    category: "Design",
                    nextLesson: "Course Introduction",
                    certified: false,
                }
            ];
        }

        const profile = user?.profile;
        if (!isStudentProfile(profile)) return [];

        return profile.enrolledCourses.map((enrollment: any) => {
            const course = enrollment.courseId;
            if (!course) return null;

            return {
                id: course._id,
                title: course.title,
                title_clean: course.title,
                instructor: course.author || "Global Instructor",
                instructorAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(course.author || "GI")}&background=random`,
                progress: enrollment.progress || 0,
                lastAccessed: new Date(enrollment.lastAccessed).toLocaleDateString(),
                image: course.thumbnail || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
                rating: 4.5, // Default for now
                totalLessons: course.syllabus?.length * 5 || 20, // Estimated
                completedLessons: Math.floor(((enrollment.progress || 0) / 100) * (course.syllabus?.length * 5 || 20)),
                duration: `${course.duration || 10}h`,
                category: course.category || "General",
                nextLesson: enrollment.progress < 100 ? "Continue Learning" : null,
                certified: enrollment.progress === 100,
            };
        }).filter(Boolean);
    }, [user]);

    const filteredCourses = React.useMemo(() => {
        return courses.filter((course: any) => {
            // Filter by status (tab)
            const matchesStatus =
                filter === "all" ||
                (filter === "inProgress" && course.progress > 0 && course.progress < 100) ||
                (filter === "completed" && course.progress === 100);

            // Filter by search term
            const matchesSearch =
                course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.category.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesStatus && matchesSearch;
        });
    }, [courses, filter, searchTerm]);

    const stats = {
        totalCourses: courses.length,
        inProgress: courses.filter((c: any) => c.progress > 0 && c.progress < 100).length,
        completed: courses.filter((c: any) => c.progress === 100).length,
        totalHours: `${courses.reduce((acc: number, curr: any) => acc + parseInt(curr.duration), 0)}h`,
    };

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 mesh-gradient min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-accent-vibrant to-accent-cyan">
                        {user?.role?.trim().toUpperCase() === 'ADMIN' ? "Student View: My Courses" : "My Learning Library"}
                    </h2>
                    <p className="text-muted-foreground">
                        {user?.role?.trim().toUpperCase() === 'ADMIN'
                            ? <span className="text-accent-vibrant font-medium">Admin Preview Mode</span>
                            : <>Welcome back, <span className="text-white font-medium">{user?.name || "Learner"}</span>. Continue your journey.</>}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search courses..."
                            className="pl-9 glass border-white/10 h-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
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
                {filteredCourses.map((course: any) => (
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
