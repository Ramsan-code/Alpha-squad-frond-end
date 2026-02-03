"use client"

import * as React from "react"
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    Cell,
    PieChart,
    Pie,
    AreaChart,
    Area
} from "recharts"
import {
    TrendingUp,
    DollarSign,
    Users,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Filter,
    ShieldCheck,
    Calendar,
    Sparkles
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth/auth-provider"

const monthlyRevenue = [
    { month: "Jan", revenue: 4500, students: 120, velocity: 12 },
    { month: "Feb", revenue: 5200, students: 145, velocity: 15 },
    { month: "Mar", revenue: 4800, students: 130, velocity: -5 },
    { month: "Apr", revenue: 6100, students: 180, velocity: 22 },
    { month: "May", revenue: 7500, students: 210, velocity: 18 },
    { month: "Jun", revenue: 8200, students: 250, velocity: 10 },
    { month: "Jul", revenue: 9500, students: 290, velocity: 15 },
]

const revenueByCourse = [
    { name: "Advanced React Mastery", value: 5200, color: "hsl(var(--accent-vibrant))" },
    { name: "AI for SaaS Builders", value: 3100, color: "hsl(var(--accent-cyan))" },
    { name: "Node.js Architecture", value: 1200, color: "#10b981" },
]

export default function RevenuePage() {
    const { user } = useAuth();
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return <div className="min-h-screen bg-black" />

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 mesh-gradient min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-accent-vibrant via-white to-accent-cyan">
                        Revenue Analytics
                    </h2>
                    <div className="flex items-center gap-2">
                        <Badge className="bg-accent-vibrant/10 text-accent-vibrant border-accent-vibrant/20">Verified Partner</Badge>
                        <p className="text-xs text-muted-foreground font-medium underline underline-offset-4 decoration-accent-cyan/30">
                            Instructor: {user?.name || "Dr. Sarah Chen"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="glass h-10 px-4 group hover:border-accent-vibrant/50 transition-all border-white/10">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-accent-vibrant transition-colors" />
                        <span className="text-sm">Last 30 Days</span>
                    </Button>
                    <Button className="bg-accent-vibrant hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] text-white h-10 px-6 transition-all border border-white/10">
                        <Download className="mr-2 h-4 w-4" /> Export Data
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Net Earnings", value: "$42,500.80", trend: "+12.5%", icon: DollarSign, color: "text-accent-vibrant", sub: "Payout on Aug 1st" },
                    { label: "Active Subs", value: "1,248", trend: "+18.2%", icon: Users, color: "text-accent-cyan", sub: "42 new this week" },
                    { label: "Conversion Rate", value: "4.8%", trend: "+2.1%", icon: TrendingUp, color: "text-green-500", sub: "LMS AI Benchmark: 3.2%" },
                    { label: "Churn Rate", value: "1.2%", trend: "-0.4%", icon: ArrowDownRight, color: "text-amber-500", sub: "Industry avg: 2.5%" },
                ].map((stat) => (
                    <Card key={stat.label} className="glass border-none shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <stat.icon className="w-16 h-16" />
                        </div>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">{stat.label}</CardTitle>
                            <div className={`p-1.5 rounded-md bg-white/5 ${stat.color}`}>
                                <stat.icon className="h-3.5 w-3.5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black tracking-tight">{stat.value}</div>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className={`text-[8px] h-4 font-bold ${stat.trend.startsWith('+') ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-red-500 border-red-500/20 bg-red-500/5'}`}>
                                    {stat.trend}
                                </Badge>
                                <span className="text-[9px] text-muted-foreground whitespace-nowrap">{stat.sub}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
                <Card className="lg:col-span-8 glass border-none shadow-2xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-bold">Revenue Dynamics</CardTitle>
                            <CardDescription>Visualizing your portfolio growth vs market trends.</CardDescription>
                        </div>
                        <Tabs defaultValue="revenue" className="h-9">
                            <TabsList className="bg-white/5 border border-white/10 p-1">
                                <TabsTrigger value="revenue" className="text-[10px] px-3">Revenue</TabsTrigger>
                                <TabsTrigger value="velocity" className="text-[10px] px-3">Velocity</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </CardHeader>
                    <CardContent className="h-[400px] w-full pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyRevenue}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--accent-vibrant))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--accent-vibrant))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    stroke="rgba(255,255,255,0.3)"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="rgba(255,255,255,0.3)"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(v) => `$${v}`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px', backdropFilter: 'blur(8px)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="hsl(var(--accent-vibrant))"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRev)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-4 glass border-none shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Sparkles className="w-32 h-32 text-accent-cyan" />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Catalog Performance</CardTitle>
                        <CardDescription>Share of wallet per course.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] flex flex-col items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={revenueByCourse}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={75}
                                    outerRadius={105}
                                    paddingAngle={10}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {revenueByCourse.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'black', border: 'none', borderRadius: '8px', fontSize: '10px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="w-full space-y-4 mt-4">
                            {revenueByCourse.map((course) => (
                                <div key={course.name} className="flex flex-col gap-1">
                                    <div className="flex items-center justify-between text-[11px]">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: course.color }} />
                                            <span className="text-muted-foreground font-medium">{course.name}</span>
                                        </div>
                                        <span className="font-bold whitespace-nowrap">${course.value}</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000"
                                            style={{
                                                width: `${(course.value / 9500) * 100}%`,
                                                backgroundColor: course.color
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="glass border-none shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-bold">Live Transaction Stream</CardTitle>
                        <CardDescription>Real-time enrollment activity across your curriculum.</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-[10px] text-accent-cyan hover:text-accent-cyan hover:bg-accent-cyan/10">View Ledger</Button>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        {[
                            { name: "Sarah Connor", course: "AI for SaaS Builders", val: "$49.99", time: "Just now", type: "Recurring", status: "Success" },
                            { name: "John Doe", course: "Advanced React Mastery", val: "$49.99", time: "4 mins ago", type: "First Sale", status: "Success" },
                            { name: "Ellen Ripley", course: "Node.js Architecture", val: "$15.00", time: "12 mins ago", type: "Discount", status: "Success" },
                            { name: "Marty McFly", course: "AI for SaaS Builders", val: "$49.99", time: "1 hour ago", type: "Recurring", status: "Success" },
                        ].map((tx, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-accent-vibrant/30 transition-all group cursor-default">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent-vibrant/20 to-accent-cyan/20 border border-white/10 flex items-center justify-center font-black text-xs">
                                        {tx.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="space-y-0.5">
                                        <h4 className="text-sm font-bold group-hover:text-accent-vibrant transition-colors">{tx.name}</h4>
                                        <p className="text-[10px] text-muted-foreground truncate max-w-[150px]">{tx.course}</p>
                                    </div>
                                </div>
                                <div className="text-right space-y-1">
                                    <div className="text-sm font-black text-white">{tx.val}</div>
                                    <div className="flex items-center gap-2 justify-end">
                                        <span className="text-[9px] text-muted-foreground italic">{tx.time}</span>
                                        <ShieldCheck className="w-3 h-3 text-green-500/50" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
