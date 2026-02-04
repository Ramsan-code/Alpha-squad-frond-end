"use client"

import * as React from "react"
import {
    ArrowLeft,
    Play,
    CheckCircle,
    BookOpen,
    FileText,
    Video,
    Award,
    Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { coursesService } from "@/lib/services/courses.service"
import { toast } from "sonner"

export default function CoursePlayerPage() {
    const params = useParams();
    const router = useRouter();
    const [currentLesson, setCurrentLesson] = React.useState(1)
    const [course, setCourse] = React.useState<any>(null)
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchCourse = async () => {
            if (!params.id) return;
            try {
                const response = await coursesService.getCourse(params.id as string);
                if (response.success && response.data) {
                    setCourse(response.data.course);
                } else {
                    toast.error("Course not found");
                    router.push("/dashboard");
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load course");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourse();
    }, [params.id, router]);

    const lessons = React.useMemo(() => {
        if (!course?.syllabus) return [];
        return course.syllabus.map((module: any, idx: number) => ({
            id: idx + 1,
            title: module.module,
            duration: `${module.duration || 10}:00`,
            type: "video",
            completed: false, // Progress not tracked at lesson level yet
        }));
    }, [course]);

    if (isLoading) {
        return (
            <div className="h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-vibrant"></div>
            </div>
        );
    }

    if (!course) return null;

    return (
        <div className="flex flex-col h-screen bg-black overflow-hidden">
            {/* Top Header */}
            <header className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-zinc-950/50 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="flex flex-col">
                        <h1 className="text-sm font-semibold truncate max-w-[300px]">{course.title}</h1>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <Progress value={25} className="h-1 w-20" />
                            <span>25% Complete</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-accent-vibrant/20 text-accent-vibrant border-none">AI Advisor Active</Badge>
                    <Button className="h-8 bg-accent-vibrant text-xs">Share Progress</Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Player Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-zinc-950">
                    <div className="flex-1 relative aspect-video bg-black flex items-center justify-center group">
                        {/* Simulated Video Player */}
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-40 blur-sm"
                            style={{ backgroundImage: `url(${course.thumbnail || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1600&auto=format&fit=crop&q=80'})` }}
                        />
                        <div className="relative z-10 text-center space-y-4">
                            <div className="h-20 w-20 rounded-full bg-accent-vibrant/20 border border-accent-vibrant/50 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                                <Play className="h-8 w-8 text-white fill-current translate-x-1" />
                            </div>
                            <h2 className="text-xl font-bold">{lessons[currentLesson - 1].title}</h2>
                        </div>

                        {/* AI Insight Overlay (Sneak peek of personalization) */}
                        <div className="absolute bottom-6 right-6 w-72 glass p-4 rounded-xl space-y-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                            <div className="flex items-center gap-2 text-accent-cyan font-bold text-xs uppercase tracking-widest">
                                <Zap className="h-3 w-3 fill-current" /> AI Quick Insight
                            </div>
                            <p className="text-xs text-white/90 leading-relaxed">
                                This lesson covers <strong>Server Actions</strong>, which we&apos;ve identified as a key gap in your &quot;Fullstack Architect&quot; goal. Pay close attention to the security section at 12:45.
                            </p>
                        </div>
                    </div>

                    {/* Content Tabs */}
                    <div className="h-64 border-t border-white/10 p-6 overflow-y-auto mesh-gradient">
                        <Tabs defaultValue="notes" className="w-full">
                            <TabsList className="bg-white/5 border border-white/10">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="notes">AI Smart Notes</TabsTrigger>
                                <TabsTrigger value="discussion">Discussion</TabsTrigger>
                                <TabsTrigger value="resources">Resources</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview" className="space-y-4 pt-4">
                                <h3 className="text-lg font-bold">About this lesson</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {course.description}
                                </p>
                            </TabsContent>
                            <TabsContent value="notes" className="space-y-4 pt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Card className="bg-white/5 border-none p-4 space-y-2">
                                        <div className="flex items-center gap-2 text-accent-cyan text-[10px] font-bold uppercase">
                                            <Video className="h-3 w-3" /> Timestamp 04:30
                                        </div>
                                        <p className="text-xs">Key takeaway: Components are server-only by default in the app router.</p>
                                    </Card>
                                    <Card className="bg-white/5 border-none p-4 space-y-2 border-l-2 border-accent-vibrant!">
                                        <div className="flex items-center gap-2 text-accent-vibrant text-[10px] font-bold uppercase">
                                            <Zap className="h-3 w-3 fill-current" /> Personalized Note
                                        </div>
                                        <p className="text-xs">You struggled with Props Drilling in your last project. This pattern solves it naturally.</p>
                                    </Card>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                {/* Sidebar Playlist */}
                <div className="w-80 border-l border-white/10 flex flex-col bg-zinc-950/80">
                    <div className="p-4 border-b border-white/10 font-bold flex items-center gap-2">
                        <BookOpen className="h-4 w-4" /> Course Content
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {lessons.map((lesson: any) => (
                            <div
                                key={lesson.id}
                                onClick={() => setCurrentLesson(lesson.id)}
                                className={`flex items-center gap-4 p-4 border-b border-white/5 cursor-pointer transition-colors ${currentLesson === lesson.id ? 'bg-accent-vibrant/10 border-r-2 border-accent-vibrant' : 'hover:bg-white/5'}`}
                            >
                                <div className="relative">
                                    {lesson.completed ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <div className="h-5 w-5 rounded-full border-2 border-white/10 flex items-center justify-center text-[10px] font-bold">
                                            {lesson.id}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className={`text-xs font-semibold ${currentLesson === lesson.id ? 'text-accent-vibrant' : 'text-white'}`}>
                                        {lesson.title}
                                    </p>
                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                        <span className="flex items-center gap-1 uppercase tracking-tighter">
                                            {lesson.type === 'video' ? <Video className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                                            {lesson.type}
                                        </span>
                                        <span>•</span>
                                        <span>{lesson.duration}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Promo/Upselling */}
                    <div className="p-4 bg-accent-vibrant/5 mt-auto border-t border-accent-vibrant/20">
                        <div className="flex items-center gap-2 text-accent-vibrant font-bold text-xs mb-2">
                            <Award className="h-4 w-4" /> Certification Progress
                        </div>
                        <Progress value={45} className="h-1.5 mb-2 bg-white/10" />
                        <p className="text-[10px] text-muted-foreground">Master 3 more concepts to earn your <strong>performance badge</strong>.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
