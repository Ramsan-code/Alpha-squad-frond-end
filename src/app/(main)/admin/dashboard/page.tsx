"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, DollarSign, TrendingUp, Activity, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts"

export default function AdminDashboard() {
    // Mock data - replace with real data from API
    const stats = {
        totalUsers: 15847,
        totalCourses: 342,
        totalRevenue: 487650,
        activeUsers: 8923,
        newUsersThisMonth: 1247,
        courseCompletionRate: 67,
    }

    const userGrowth = [
        { month: "Jan", users: 12450 },
        { month: "Feb", users: 13180 },
        { month: "Mar", users: 13920 },
        { month: "Apr", users: 14247 },
        { month: "May", users: 14890 },
        { month: "Jun", users: 15320 },
        { month: "Jul", users: 15680 },
        { month: "Aug", users: 15847 },
    ]

    const recentUsers = [
        { id: 1, name: "John Doe", email: "john@example.com", role: "STUDENT", status: "active", joined: "2 hours ago" },
        { id: 2, name: "Sarah Johnson", email: "sarah@example.com", role: "INSTRUCTOR", status: "active", joined: "5 hours ago" },
        { id: 3, name: "Mike Chen", email: "mike@example.com", role: "STUDENT", status: "pending", joined: "1 day ago" },
        { id: 4, name: "Emma Wilson", email: "emma@example.com", role: "PARENT", status: "active", joined: "2 days ago" },
    ]



    const systemHealth = [
        { metric: "API Response Time", value: "124ms", status: "good", percentage: 95 },
        { metric: "Database Performance", value: "98%", status: "good", percentage: 98 },
        { metric: "Storage Usage", value: "67%", status: "warning", percentage: 67 },
        { metric: "Active Sessions", value: "8,923", status: "good", percentage: 85 },
    ]

    const topCourses = [
        { id: 1, title: "Machine Learning Fundamentals", students: 2847, revenue: 71175, rating: 4.8 },
        { id: 2, title: "Advanced React Patterns", students: 2134, rating: 4.9, revenue: 53350 },
        { id: 3, title: "Full Stack Web Development", students: 1923, revenue: 48075, rating: 4.7 },
    ]

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "good":
                return <CheckCircle className="h-4 w-4 text-green-500" />
            case "warning":
                return <AlertCircle className="h-4 w-4 text-amber-500" />
            case "error":
                return <XCircle className="h-4 w-4 text-red-500" />
            default:
                return <Activity className="h-4 w-4 text-muted-foreground" />
        }
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard 🛡️</h1>
                <p className="text-muted-foreground">Platform overview and management</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card className="glass border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-accent-vibrant" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            +{stats.newUsersThisMonth.toLocaleString()} this month
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                        <BookOpen className="h-4 w-4 text-accent-cyan" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalCourses}</div>
                        <p className="text-xs text-muted-foreground">
                            3 pending approval
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            +18% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% of total
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* System Health */}
            <Card className="glass border-white/10">
                <CardHeader>
                    <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {systemHealth.map((item) => (
                            <div key={item.metric} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{item.metric}</span>
                                    {getStatusIcon(item.status)}
                                </div>
                                <div className="text-2xl font-bold">{item.value}</div>
                                <Progress value={item.percentage} className="h-2" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Users */}
                <Card className="glass border-white/10">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Recent Users</CardTitle>
                            <Button variant="ghost" size="sm">View All</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentUsers.map((user) => (
                                <div key={user.id} className="flex items-center justify-between pb-4 border-b border-white/10 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-sm">{user.name}</p>
                                            <Badge variant="outline" className="text-xs">
                                                {user.role}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <Badge
                                            variant={user.status === "active" ? "default" : "secondary"}
                                            className={user.status === "active" ? "bg-green-500/10 text-green-500" : ""}
                                        >
                                            {user.status}
                                        </Badge>
                                        <p className="text-xs text-muted-foreground">{user.joined}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>


            </div>

            {/* Top Performing Courses */}
            <Card className="glass border-white/10">
                <CardHeader>
                    <CardTitle>Top Performing Courses</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {topCourses.map((course, index) => (
                            <div key={course.id} className="flex items-center gap-4 pb-4 border-b border-white/10 last:border-0 last:pb-0">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-vibrant/10 text-accent-vibrant font-bold">
                                    #{index + 1}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="font-semibold">{course.title}</p>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span>{course.students.toLocaleString()} students</span>
                                        <span>⭐ {course.rating}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-green-500">${course.revenue.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">revenue</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* User Growth Trend */}
            <Card className="glass border-white/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-accent-vibrant" />
                        User Growth Trend
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={userGrowth} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="month"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    domain={['dataMin - 500', 'dataMax + 500']}
                                    tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1b1e', borderColor: '#333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                                <Area
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#growthGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
