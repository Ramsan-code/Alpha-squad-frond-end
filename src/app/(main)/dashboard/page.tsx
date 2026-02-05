"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BookOpen, Clock, Award, Target, Play, ChevronRight, Flame, Star, Bell, Calendar, ArrowRight, Sparkles, Bot } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { useAuth } from "@/components/auth/auth-provider"
import { isStudentProfile } from "@/types/profile"

export default function StudentDashboard() {
    const { user } = useAuth();

    // Map backend data to dashboard format
    const dashboardData = React.useMemo(() => {
        // ADMIN PREVIEW MODE: Inject mock data
        if (user?.role?.trim().toUpperCase() === 'ADMIN') {
            return {
                stats: {
                    coursesEnrolled: 3,
                    coursesCompleted: 1,
                    hoursLearned: 28,
                    certificatesEarned: 1,
                    currentStreak: 12,
                    weeklyGoal: 85,
                },
                activeCourses: [
                    {
                        id: "mock-1",
                        title: "Advanced React Patterns",
                        progress: 65,
                        instructor: "Sarah Drasner",
                        instructorAvatar: "https://ui-avatars.com/api/?name=SD&background=random",
                        nextLesson: "Compound Components",
                        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop",
                        category: "Frontend",
                        rating: 4.8
                    },
                    {
                        id: "mock-2",
                        title: "System Design for Scale",
                        progress: 42,
                        instructor: "Alex Xu",
                        instructorAvatar: "https://ui-avatars.com/api/?name=AX&background=random",
                        nextLesson: "Load Balancing Strategy",
                        thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=200&fit=crop",
                        category: "Backend",
                        rating: 4.9
                    }
                ]
            };
        }

        const profile = user?.profile;
        if (!isStudentProfile(profile)) {
            return { stats: { coursesEnrolled: 0, coursesCompleted: 0, hoursLearned: 0, certificatesEarned: 0, currentStreak: 0, weeklyGoal: 0 }, activeCourses: [] };
        }

        const enrolled = profile.enrolledCourses;
        const courses = enrolled.map((enrollment: any) => {
            const course = enrollment.courseId;
            if (!course) return null;
            return {
                id: course._id,
                title: course.title,
                progress: enrollment.progress || 0,
                instructor: course.author || "Global Instructor",
                instructorAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(course.author || "GI")}&background=random`,
                nextLesson: enrollment.progress < 100 ? "Continue Learning" : "Completed",
                thumbnail: course.thumbnail || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop",
                category: course.category || "General",
                rating: 4.5,
            };
        }).filter(Boolean);

        const completedCount = courses.filter((c: any) => c.progress === 100).length;
        const totalHours = courses.reduce((acc: number, curr: any) => acc + (parseInt(curr.duration) || 10), 0);

        return {
            stats: {
                coursesEnrolled: courses.length,
                coursesCompleted: completedCount,
                hoursLearned: totalHours,
                certificatesEarned: completedCount,
                currentStreak: 2, // Dummy for now
                weeklyGoal: 75,
            },
            activeCourses: courses.filter((c: any) => c.progress < 100).slice(0, 3)
        };
    }, [user]);

    const { stats, activeCourses } = dashboardData;

    const upcomingAssignments = [
        { id: 1, course: "Advanced React Patterns", title: "Build a Custom Hook Library", dueDate: "Feb 5, 2026", priority: "high", daysLeft: 3 },
        { id: 2, course: "AI Integration", title: "Implement RAG Pipeline", dueDate: "Feb 8, 2026", priority: "medium", daysLeft: 6 },
        { id: 3, course: "Cloud Architecture", title: "Final Portfolio Project", dueDate: "Feb 12, 2026", priority: "high", daysLeft: 10 },
    ]

    const aiRecommendations = [
        { title: "TypeScript Advanced Patterns", reason: "Based on your React skills", match: 94 },
        { title: "System Design Interview Prep", reason: "Trending in your field", match: 87 },
    ]

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 mesh-gradient min-h-screen">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-accent-vibrant to-accent-cyan">
                            {user?.role?.trim().toUpperCase() === 'ADMIN' ? "Student View" : `Welcome back, ${user?.name?.split(' ')[0] || "Learner"}!`}
                        </h1>
                        {user?.role?.trim().toUpperCase() === 'ADMIN' && <Badge variant="outline" className="text-accent-vibrant border-accent-vibrant">Admin Preview</Badge>}
                        {user?.role?.trim().toUpperCase() !== 'ADMIN' && (
                            <Badge className="bg-accent-vibrant/10 text-accent-vibrant border-accent-vibrant/20">
                                <Flame className="h-3 w-3 mr-1" /> {stats.currentStreak} day streak
                            </Badge>
                        )}
                    </div>
                    <p className="text-muted-foreground">Continue your learning journey and reach your goals.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="glass border-white/10 relative"
                        onClick={() => {
                            toast.info("Notification Center", {
                                description: "You have 3 new updates: 'Advanced React' assignment due, and 2 new AI recommendations."
                            });
                        }}
                    >
                        <Bell className="h-4 w-4" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-[8px] flex items-center justify-center">3</span>
                    </Button>
                    <Link href={activeCourses.length > 0 ? `/courses/${activeCourses[0]?.id}` : "/courses"}>
                        <Button className="bg-accent-vibrant hover:bg-accent-vibrant/90 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                            <Play className="h-4 w-4 mr-2 fill-current" /> Resume Learning
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-5">
                {[
                    { label: "Courses Enrolled", value: stats.coursesEnrolled, sub: `${stats.coursesCompleted} completed`, icon: BookOpen, color: "text-accent-vibrant" },
                    { label: "Hours Learned", value: `${stats.hoursLearned}h`, sub: "+12h this week", icon: Clock, color: "text-accent-cyan" },
                    { label: "Certificates", value: stats.certificatesEarned, sub: "View all", icon: Award, color: "text-amber-500" },
                    { label: "Current Streak", value: `${stats.currentStreak} days`, sub: "Personal best!", icon: Flame, color: "text-orange-500" },
                    { label: "Weekly Goal", value: `${stats.weeklyGoal}%`, sub: "2h 15m remaining", icon: Target, color: "text-green-500" },
                ].map((stat) => (
                    <Card key={stat.label} className="glass border-none relative overflow-hidden group hover:scale-[1.02] transition-all">
                        <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <stat.icon className="h-16 w-16" />
                        </div>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{stat.label}</p>
                                    <p className="text-2xl font-black mt-1">{stat.value}</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">{stat.sub}</p>
                                </div>
                                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                                    <stat.icon className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-12">
                {/* Active Courses */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-accent-vibrant" /> Continue Learning
                        </h2>
                        <Link href="/courses">
                            <Button variant="ghost" size="sm" className="text-[11px] text-muted-foreground hover:text-white">
                                View All <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {activeCourses.map((course: any) => (
                            <Card key={course.id} className="glass border-none overflow-hidden group hover:scale-[1.01] transition-all">
                                <div className="flex flex-col sm:flex-row">
                                    <div className="relative w-full sm:w-48 h-32 shrink-0 overflow-hidden">
                                        <Image
                                            src={course.thumbnail}
                                            alt={course.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/80 sm:bg-gradient-to-t sm:from-black/60 sm:to-transparent" />
                                        <div className="absolute top-2 left-2">
                                            <Badge className="bg-black/60 backdrop-blur-sm text-[9px]">{course.category}</Badge>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                            <Button size="sm" className="bg-accent-vibrant text-white rounded-full shadow-[0_0_20px_rgba(124,58,237,0.5)]">
                                                <Play className="h-4 w-4 fill-current" />
                                            </Button>
                                        </div>
                                    </div>
                                    <CardContent className="flex-1 p-4 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <h3 className="font-bold text-sm leading-tight">{course.title}</h3>
                                                <div className="flex items-center gap-1 text-amber-500 text-[10px] shrink-0">
                                                    <Star className="h-3 w-3 fill-current" /> {course.rating}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Image
                                                    src={course.instructorAvatar}
                                                    alt={course.instructor}
                                                    width={20}
                                                    height={20}
                                                    className="rounded-full"
                                                />
                                                <span className="text-[11px] text-muted-foreground">{course.instructor}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-[10px]">
                                                <span className="text-muted-foreground">Progress</span>
                                                <span className="font-bold">{course.progress}%</span>
                                            </div>
                                            <Progress value={course.progress} className="h-1.5 bg-white/10">
                                                <div className="h-full bg-accent-vibrant rounded-full" style={{ width: `${course.progress}%` }} />
                                            </Progress>
                                            <div className="flex items-center justify-between pt-1">
                                                <p className="text-[10px] text-muted-foreground">
                                                    <span className="text-accent-cyan">Next:</span> {course.nextLesson}
                                                </p>
                                                <Link href={`/courses/${course.id}`}>
                                                    <Button size="sm" variant="ghost" className="text-[10px] h-7 text-accent-vibrant hover:text-accent-vibrant">
                                                        Continue <ArrowRight className="h-3 w-3 ml-1" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Upcoming Assignments */}
                    <Card className="glass border-none">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-accent-cyan" /> Upcoming Deadlines
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {upcomingAssignments.map((assignment) => (
                                <div key={assignment.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-accent-vibrant/30 transition-colors group cursor-pointer">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{assignment.title}</p>
                                            <p className="text-[10px] text-muted-foreground">{assignment.course}</p>
                                        </div>
                                        <Badge className={`shrink-0 text-[8px] ${assignment.priority === 'high'
                                            ? 'bg-red-500/10 text-red-500'
                                            : 'bg-amber-500/10 text-amber-500'
                                            }`}>
                                            {assignment.daysLeft}d left
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* AI Recommendations */}
                    <Card className="glass border-accent-vibrant/20 bg-gradient-to-br from-accent-vibrant/5 to-transparent relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-accent-vibrant/10 blur-[60px] rounded-full" />
                        <CardHeader className="pb-3 relative">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-accent-vibrant" /> AI Recommendations
                            </CardTitle>
                            <CardDescription className="text-[11px]">Personalized for your goals</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 relative">
                            {aiRecommendations.map((rec, idx) => (
                                <div key={idx} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-accent-vibrant/30 transition-all group cursor-pointer">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{rec.title}</p>
                                            <p className="text-[10px] text-muted-foreground">{rec.reason}</p>
                                        </div>
                                        <Badge className="bg-accent-vibrant/10 text-accent-vibrant text-[9px]">
                                            {rec.match}% match
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                            <Button className="w-full bg-accent-vibrant/10 text-accent-vibrant hover:bg-accent-vibrant/20 text-[11px] mt-2">
                                <Bot className="h-4 w-4 mr-2" /> Ask AI Tutor
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Weekly Goal Progress */}
                    <Card className="glass border-none overflow-hidden">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Target className="h-5 w-5 text-green-500" /> Weekly Goal
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative pt-4">
                                <div className="flex items-center justify-center">
                                    <div className="relative w-32 h-32">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="56"
                                                fill="none"
                                                stroke="rgba(255,255,255,0.05)"
                                                strokeWidth="12"
                                            />
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="56"
                                                fill="none"
                                                stroke="url(#gradient)"
                                                strokeWidth="12"
                                                strokeLinecap="round"
                                                strokeDasharray={`${stats.weeklyGoal * 3.52} 352`}
                                            />
                                            <defs>
                                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="hsl(var(--accent-vibrant))" />
                                                    <stop offset="100%" stopColor="#10b981" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-3xl font-black">{stats.weeklyGoal}%</span>
                                            <span className="text-[10px] text-muted-foreground">Complete</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="text-sm text-muted-foreground">
                                        <span className="text-white font-bold">2h 15m</span> more to hit your 10h goal
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
