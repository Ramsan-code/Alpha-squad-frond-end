"use client"

import * as React from "react"
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
    AreaChart,
    Area
} from "recharts"
import {
    Activity,
    ArrowUpRight,
    Download,
    TrendingUp,
    Users,
    CheckCircle2,
    ShieldCheck,
    Star,
    Clock,
    Target,
    Award,
    BookOpen,
    Flame
} from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth/auth-provider"

const weeklyEngagement = [
    { day: "Mon", hours: 2.1, lessons: 4 },
    { day: "Tue", hours: 4.5, lessons: 8 },
    { day: "Wed", hours: 3.2, lessons: 6 },
    { day: "Thu", hours: 5.8, lessons: 11 },
    { day: "Fri", hours: 2.4, lessons: 5 },
    { day: "Sat", hours: 1.2, lessons: 2 },
    { day: "Sun", hours: 0.8, lessons: 1 },
]

const monthlyProgress = [
    { month: "Aug", completion: 15, hours: 12 },
    { month: "Sep", completion: 28, hours: 22 },
    { month: "Oct", completion: 42, hours: 35 },
    { month: "Nov", completion: 55, hours: 42 },
    { month: "Dec", completion: 68, hours: 52 },
    { month: "Jan", completion: 78, hours: 60 },
]

const skillData = [
    { name: "React/Next.js", value: 85, color: "hsl(var(--accent-vibrant))" },
    { name: "TypeScript", value: 72, color: "hsl(var(--accent-cyan))" },
    { name: "Node.js", value: 58, color: "#10b981" },
    { name: "System Design", value: 45, color: "#f59e0b" },
    { name: "DevOps", value: 30, color: "#ec4899" },
]

const achievements = [
    { label: "Completed 'Advanced Hooks'", date: "2 hours ago", icon: CheckCircle2, color: "text-green-500" },
    { label: "New Skill Badge: Architect", date: "Yesterday", icon: Award, color: "text-amber-400" },
    { label: "Reached 20-day streak!", date: "2 days ago", icon: Flame, color: "text-orange-500" },
    { label: "Top 5% in Quiz Challenge", date: "3 days ago", icon: Star, color: "text-accent-cyan" },
    { label: "Compliance: Security 101", date: "Last week", icon: ShieldCheck, color: "text-accent-vibrant" },
]

export default function AnalyticsPage() {
    const { user } = useAuth();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="flex-1 mesh-gradient min-h-screen" />;

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 mesh-gradient min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-accent-vibrant via-white to-accent-cyan">
                        Learning Analytics
                    </h2>
                    <p className="text-muted-foreground">
                        Deep insights into your performance, {user?.name?.split(' ')[0] || "Learner"}.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Tabs defaultValue="week">
                        <TabsList className="bg-white/5 border border-white/10 p-1">
                            <TabsTrigger value="week" className="text-[10px]">This Week</TabsTrigger>
                            <TabsTrigger value="month" className="text-[10px]">This Month</TabsTrigger>
                            <TabsTrigger value="year" className="text-[10px]">This Year</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Button className="glass hover:bg-white/10 border-white/10">
                        <Download className="mr-2 h-4 w-4" /> Export PDF
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {[
                    { label: "Study Hours", value: "20.5h", trend: "+15%", icon: Clock, color: "text-accent-vibrant" },
                    { label: "Lessons Done", value: "37", trend: "+23%", icon: BookOpen, color: "text-accent-cyan" },
                    { label: "Completion Rate", value: "78%", trend: "+8%", icon: Target, color: "text-green-500" },
                    { label: "Current Streak", value: "20 days", trend: "Best!", icon: Flame, color: "text-orange-500" },
                    { label: "Peer Rank", value: "Top 5%", trend: "+2", icon: Users, color: "text-amber-500" },
                ].map((stat) => (
                    <Card key={stat.label} className="glass border-none relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <stat.icon className="h-16 w-16" />
                        </div>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{stat.label}</p>
                                    <p className="text-2xl font-black mt-1">{stat.value}</p>
                                </div>
                                <Badge className="bg-green-500/10 text-green-500 border-none text-[10px]">
                                    <ArrowUpRight className="h-3 w-3 mr-0.5" /> {stat.trend}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-12">
                {/* Weekly Engagement */}
                <Card className="lg:col-span-5 glass border-none">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-base">Weekly Engagement</CardTitle>
                            <CardDescription>Hours studied per day</CardDescription>
                        </div>
                        <Activity className="h-5 w-5 text-accent-vibrant" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyEngagement}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}h`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px' }}
                                    />
                                    <Bar dataKey="hours" fill="hsl(var(--accent-vibrant))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Progress Over Time */}
                <Card className="lg:col-span-7 glass border-none">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-base">Progress Trajectory</CardTitle>
                            <CardDescription>Course completion over time</CardDescription>
                        </div>
                        <TrendingUp className="h-5 w-5 text-accent-cyan" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={monthlyProgress}>
                                    <defs>
                                        <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--accent-cyan))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--accent-cyan))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px' }}
                                    />
                                    <Area type="monotone" dataKey="completion" stroke="hsl(var(--accent-cyan))" strokeWidth={3} fillOpacity={1} fill="url(#colorCompletion)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Skills & Achievements Row */}
            <div className="grid gap-6 lg:grid-cols-12">
                {/* Skill Breakdown */}
                <Card className="lg:col-span-7 glass border-none">
                    <CardHeader>
                        <CardTitle className="text-base">Skill Proficiency</CardTitle>
                        <CardDescription>AI-analyzed competency levels across domains</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-5">
                            {skillData.map((skill) => (
                                <div key={skill.name} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">{skill.name}</span>
                                        <span className="text-sm font-bold" style={{ color: skill.color }}>{skill.value}%</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000"
                                            style={{ width: `${skill.value}%`, backgroundColor: skill.color }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Achievements */}
                <Card className="lg:col-span-5 glass border-none">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Award className="h-5 w-5 text-amber-500" /> Recent Achievements
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {achievements.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer">
                                    <div className={`p-2 rounded-full bg-white/5 ${item.color} group-hover:scale-110 transition-transform`}>
                                        <item.icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{item.label}</p>
                                        <p className="text-[10px] text-muted-foreground">{item.date}</p>
                                    </div>
                                    <ArrowUpRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
