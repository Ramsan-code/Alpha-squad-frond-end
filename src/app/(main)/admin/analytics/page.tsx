"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, BookOpen, Clock, Target } from "lucide-react"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function PlatformAnalytics() {
    const metrics = [
        { title: "Avg. Engagement Time", value: "42m 15s", change: "+5.2%", icon: Clock, color: "text-blue-500" },
        { title: "Course Completion", value: "68.4%", change: "+2.1%", icon: Target, color: "text-green-500" },
        { title: "Active Instructors", value: "312", change: "+12", icon: Users, color: "text-accent-vibrant" },
        { title: "Search Popularity", value: "84%", change: "+14.5%", icon: TrendingUp, color: "text-accent-cyan" },
    ]

    const retentionData = [
        { week: 'Week 1', retention: 100 },
        { week: 'Week 2', retention: 85 },
        { week: 'Week 3', retention: 72 },
        { week: 'Week 4', retention: 68 },
        { week: 'Week 5', retention: 65 },
        { week: 'Week 6', retention: 62 },
        { week: 'Week 7', retention: 60 },
        { week: 'Week 8', retention: 58 },
    ]

    const categoryData = [
        { name: 'Web Dev', students: 2400 },
        { name: 'Data Science', students: 1800 },
        { name: 'Design', students: 1200 },
        { name: 'Marketing', students: 980 },
        { name: 'Business', students: 850 },
    ]

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Platform Analytics 📊</h1>
                <p className="text-muted-foreground">Deep dive into platform performance and user behavior</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {metrics.map((m) => (
                    <Card key={m.title} className="glass border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{m.title}</CardTitle>
                            <m.icon className={`h-4 w-4 ${m.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{m.value}</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-green-500">{m.change}</span> since last month
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="glass border-white/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-accent-vibrant" /> User Retention Trend
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={retentionData}>
                                    <defs>
                                        <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                                        itemStyle={{ color: '#f8fafc' }}
                                    />
                                    <Area type="monotone" dataKey="retention" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRetention)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass border-white/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-accent-cyan" /> Popular Categories
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.1)" />
                                    <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis dataKey="name" type="category" width={100} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                                        itemStyle={{ color: '#f8fafc' }}
                                    />
                                    <Bar dataKey="students" fill="#06b6d4" radius={[0, 4, 4, 0]} barSize={32} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="glass border-white/10">
                <CardHeader>
                    <CardTitle>Peak Activity Times</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] flex items-end gap-1">
                        {[40, 60, 45, 90, 100, 80, 50, 30, 20, 40, 70, 85, 95, 60, 40, 30, 50, 80, 100, 90, 70, 50, 40, 30].map((v, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-accent-vibrant/20 hover:bg-accent-vibrant transition-all rounded-t-sm"
                                style={{ height: `${v}%` }}
                                title={`${i}:00 - ${v}% activity`}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-muted-foreground px-1">
                        <span>00:00</span>
                        <span>06:00</span>
                        <span>12:00</span>
                        <span>18:00</span>
                        <span>23:00</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
