"use client"

import * as React from "react"
import {
    XAxis,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from "recharts"
import {
    BookOpen,
    Clock,
    TrendingUp,
    ShieldCheck,
    Star,
    Bell,
    Settings
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"


const studentPerformance = [
    { subject: "React", score: 85 },
    { subject: "Node.js", score: 72 },
    { subject: "Design", score: 90 },
    { subject: "AI Ethics", score: 65 },
    { subject: "Python", score: 88 },
]

export default function ParentDashboard() {
    return (
        <div className="flex-1 space-y-8 p-8 pt-6 mesh-gradient min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-accent-vibrant">
                        Parent Control Center
                    </h2>
                    <p className="text-muted-foreground">Monitoring Alex Rivera&apos;s educational progress and subscription status.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="glass">
                        <Settings className="mr-2 h-4 w-4" /> Manage Access
                    </Button>
                    <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                        <Bell className="mr-2 h-4 w-4" /> Notifications
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Completion Rate", value: "78%", icon: TrendingUp, color: "text-green-500" },
                    { label: "Courses Active", value: "4", icon: BookOpen, color: "text-accent-vibrant" },
                    { label: "Learning Hours", value: "112h", icon: Clock, color: "text-accent-cyan" },
                    { label: "Skill Badges", value: "12", icon: Star, color: "text-amber-500" },
                ].map((stat) => (
                    <Card key={stat.label} className="glass border-none shadow-xl">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-[10px] text-muted-foreground mt-1">Updated 10m ago</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card className="glass border-none">
                    <CardHeader>
                        <CardTitle>Subject Proficiency</CardTitle>
                        <CardDescription>Academic performance across key modules.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] w-full pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={studentPerformance}>
                                <XAxis dataKey="subject" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '12px' }} />
                                <Bar dataKey="score" fill="hsl(var(--accent-vibrant))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="glass border-none">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Alex&apos;s latest milestones and achievements.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {[
                            { title: "Completed 'React Hooks' Quiz", date: "Today, 2:30 PM", score: "95%", icon: TrendingUp, color: "text-green-500" },
                            { title: "Started 'Next.js 15' Module", date: "Yesterday", score: "In Progress", icon: BookOpen, color: "text-accent-cyan" },
                            { title: "Earned 'Code Master' Badge", date: "2 days ago", score: "Achievement", icon: Star, color: "text-amber-500" },
                        ].map((activity, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className={`h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center ${activity.color}`}>
                                    <activity.icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold">{activity.title}</h4>
                                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                                </div>
                                <Badge variant="outline" className={`text-[10px] ${activity.color} border-current/20`}>{activity.score}</Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <Card className="glass border-none overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <ShieldCheck className="w-32 h-32 text-pink-500" />
                </div>
                <CardHeader>
                    <CardTitle>Account & Subscription</CardTitle>
                    <CardDescription>Manage billing and educational plan.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 space-y-4 w-full">
                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                            <div>
                                <h4 className="font-bold">Enterprise Pro Plan</h4>
                                <p className="text-xs text-muted-foreground">Next billing date: March 15, 2026</p>
                            </div>
                            <Badge className="bg-green-500 text-white">Active</Badge>
                        </div>
                        <div className="flex gap-2">
                            <Button className="flex-1 bg-accent-vibrant hover:bg-accent-vibrant/90 text-white">Renew Subscription</Button>
                            <Button variant="outline" className="flex-1 glass">View Invoice</Button>
                        </div>
                    </div>
                    <div className="w-px h-24 bg-white/10 hidden md:block" />
                    <div className="flex-1 space-y-4 w-full">
                        <h4 className="text-sm font-bold">Safe Learning Mode</h4>
                        <p className="text-xs text-muted-foreground">AI filtering is enabled to ensure academic-only content for Alex.</p>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[90%]" />
                            </div>
                            <span className="text-[10px] font-bold">Secure</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
