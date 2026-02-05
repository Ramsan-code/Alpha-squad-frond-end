"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, DollarSign, TrendingUp, Activity, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { adminService, PendingUser } from "@/lib/services/admin.service"
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
    const [isLoading, setIsLoading] = useState(true);
    const [pendingStudents, setPendingStudents] = useState<PendingUser[]>([]);
    const [pendingTeachers, setPendingTeachers] = useState<PendingUser[]>([]);

    const fetchPendingApprovals = async () => {
        try {
            const response = await adminService.getPendingApprovals();
            if (response.success && response.data) {
                setPendingStudents(response.data.students || []);
                setPendingTeachers(response.data.teachers || []);
            }
        } catch (error) {
            console.error("Failed to fetch pending approvals:", error);
            toast.error("Failed to load pending approvals");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingApprovals();
    }, []);

    const handleApprove = async (id: string, role: 'student' | 'teacher') => {
        try {
            if (role === 'student') {
                await adminService.approveStudent(id);
            } else {
                await adminService.approveTeacher(id);
            }
            toast.success(`${role === 'student' ? 'Student' : 'Instructor'} approved successfully`);
            fetchPendingApprovals();
        } catch (error) {
            toast.error("Failed to approve user");
            console.error(error);
        }
    };

    const handleReject = async (id: string, role: 'student' | 'teacher') => {
        try {
            if (role === 'student') {
                await adminService.rejectStudent(id, "Admin rejected");
            } else {
                await adminService.rejectTeacher(id, "Admin rejected");
            }
            toast.success(`${role === 'student' ? 'Student' : 'Instructor'} rejected`);
            fetchPendingApprovals();
        } catch (error) {
            toast.error("Failed to reject user");
            console.error(error);
        }
    };

    // Mock stats for display only - in real app, these would come from an analytics endpoint
    const stats = {
        totalUsers: 15847,
        totalCourses: 342,
        totalRevenue: 487650,
        activeUsers: 8923,
        newUsersThisMonth: 1247,
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
                        <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                        <BookOpen className="h-4 w-4 text-accent-cyan" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {pendingStudents.length + pendingTeachers.length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Requires action
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

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Pending Approvals Section */}
                <Card className="glass border-white/10 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Pending Approvals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="students" className="w-full">
                            <TabsList className="bg-white/5 border border-white/10">
                                <TabsTrigger value="students">Students ({pendingStudents.length})</TabsTrigger>
                                <TabsTrigger value="teachers">Instructors ({pendingTeachers.length})</TabsTrigger>
                            </TabsList>

                            <TabsContent value="students" className="mt-4">
                                {pendingStudents.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No pending student approvals
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {pendingStudents.map((student) => (
                                            <div key={student._id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold">{student.firstName} {student.lastName}</p>
                                                        <Badge variant="outline" className="text-xs bg-accent-vibrant/10 text-accent-vibrant border-accent-vibrant/20">
                                                            Student
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{student.userId.email}</p>
                                                    <p className="text-xs text-muted-foreground">Grade: {student.gradeLevel}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                                        onClick={() => handleReject(student._id, 'student')}
                                                    >
                                                        <XCircle className="h-4 w-4 mr-1" /> Reject
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700 text-white"
                                                        onClick={() => handleApprove(student._id, 'student')}
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="teachers" className="mt-4">
                                {pendingTeachers.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No pending instructor approvals
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {pendingTeachers.map((teacher) => (
                                            <div key={teacher._id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold">{teacher.firstName} {teacher.lastName}</p>
                                                        <Badge variant="outline" className="text-xs bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20">
                                                            Instructor
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{teacher.userId.email}</p>
                                                    <p className="text-xs text-muted-foreground">Spec: {teacher.specialization} • Exp: {teacher.experience} yrs</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                                        onClick={() => handleReject(teacher._id, 'teacher')}
                                                    >
                                                        <XCircle className="h-4 w-4 mr-1" /> Reject
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700 text-white"
                                                        onClick={() => handleApprove(teacher._id, 'teacher')}
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

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
