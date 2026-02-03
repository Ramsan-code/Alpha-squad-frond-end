import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, BookOpen, Star, Eye, BarChart3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"

export default function TeacherDashboard() {
    // Mock data - replace with real data from API
    const stats = {
        totalRevenue: 24580,
        totalStudents: 1247,
        activeCourses: 12,
        avgRating: 4.8,
    }

    const courses = [
        {
            id: 1,
            title: "Advanced React Patterns",
            students: 342,
            revenue: 8540,
            rating: 4.9,
            reviews: 87,
            published: true,
            thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop",
        },
        {
            id: 2,
            title: "Machine Learning Fundamentals",
            students: 518,
            revenue: 12950,
            rating: 4.7,
            reviews: 124,
            published: true,
            thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop",
        },
        {
            id: 3,
            title: "TypeScript Masterclass",
            students: 0,
            revenue: 0,
            rating: 0,
            reviews: 0,
            published: false,
            thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=200&fit=crop",
        },
    ]

    const recentActivity = [
        { id: 1, student: "John Doe", action: "completed", course: "Advanced React Patterns", time: "2 hours ago" },
        { id: 2, student: "Sarah Smith", action: "enrolled", course: "Machine Learning Fundamentals", time: "5 hours ago" },
        { id: 3, student: "Mike Johnson", action: "left review", course: "Advanced React Patterns", time: "1 day ago", rating: 5 },
        { id: 4, student: "Emma Wilson", action: "asked question", course: "Machine Learning Fundamentals", time: "1 day ago" },
    ]

    const pendingReviews = [
        { id: 1, student: "Alex Turner", assignment: "Build a Custom Hook Library", course: "Advanced React Patterns", submitted: "3 hours ago" },
        { id: 2, student: "Lisa Chen", assignment: "Implement Linear Regression", course: "Machine Learning Fundamentals", submitted: "1 day ago" },
    ]

    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Instructor Studio 🎓</h1>
                <p className="text-muted-foreground">Manage your courses and track your success</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="glass border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            +12% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-accent-vibrant" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            +89 new this week
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                        <BookOpen className="h-4 w-4 text-accent-cyan" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeCourses}</div>
                        <p className="text-xs text-muted-foreground">
                            1 in draft
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
                        <Star className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.avgRating}</div>
                        <p className="text-xs text-muted-foreground">
                            From 211 reviews
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Courses Management */}
            <Tabs defaultValue="all" className="space-y-4">
                <div className="flex items-center justify-between">
                    <TabsList className="glass">
                        <TabsTrigger value="all">All Courses</TabsTrigger>
                        <TabsTrigger value="published">Published</TabsTrigger>
                        <TabsTrigger value="draft">Draft</TabsTrigger>
                    </TabsList>
                    <Link href="/teach/courses/create">
                        <Button className="bg-accent-vibrant hover:bg-accent-vibrant/90">
                            Create New Course
                        </Button>
                    </Link>
                </div>

                <TabsContent value="all" className="space-y-4">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course) => (
                            <Card key={course.id} className="glass border-white/10 overflow-hidden group hover:border-accent-vibrant/50 transition-all">
                                <div className="aspect-video w-full overflow-hidden bg-muted relative">
                                    <Image
                                        src={course.thumbnail}
                                        alt={course.title}
                                        width={400}
                                        height={225}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {!course.published && (
                                        <div className="absolute top-2 right-2 px-2 py-1 bg-amber-500/90 text-xs font-bold rounded">
                                            DRAFT
                                        </div>
                                    )}
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="space-y-1">
                                            <p className="text-muted-foreground">Students</p>
                                            <p className="font-semibold">{course.students}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-muted-foreground">Revenue</p>
                                            <p className="font-semibold">${course.revenue.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    {course.published && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                            <span className="font-semibold">{course.rating}</span>
                                            <span className="text-muted-foreground">({course.reviews} reviews)</span>
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1">
                                            <Eye className="h-4 w-4 mr-1" />
                                            View
                                        </Button>
                                        <Button variant="outline" size="sm" className="flex-1">
                                            <BarChart3 className="h-4 w-4 mr-1" />
                                            Analytics
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Activity */}
                <Card className="glass border-white/10">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-white/10 last:border-0 last:pb-0">
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm">
                                            <span className="font-semibold">{activity.student}</span>
                                            {" "}
                                            <span className="text-muted-foreground">{activity.action}</span>
                                            {activity.rating && (
                                                <span className="ml-1">
                                                    <Star className="h-3 w-3 inline text-amber-500 fill-amber-500" />
                                                    {activity.rating}
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{activity.course}</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Reviews */}
                <Card className="glass border-white/10">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Pending Reviews</CardTitle>
                            <span className="px-2 py-1 bg-accent-vibrant/10 text-accent-vibrant text-xs font-bold rounded-full">
                                {pendingReviews.length}
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {pendingReviews.map((review) => (
                                <div key={review.id} className="p-4 rounded-lg bg-white/5 space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="space-y-1 flex-1">
                                            <p className="font-semibold text-sm">{review.assignment}</p>
                                            <p className="text-xs text-muted-foreground">{review.student} • {review.course}</p>
                                        </div>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">{review.submitted}</span>
                                    </div>
                                    <Button size="sm" className="w-full bg-accent-vibrant hover:bg-accent-vibrant/90">
                                        Review Submission
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
