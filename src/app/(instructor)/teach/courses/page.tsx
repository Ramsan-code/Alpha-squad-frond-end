"use client"

import { Plus, BookOpen, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function InstructorCoursesPage() {
    const courses = [
        { title: "Advanced React Patterns", students: 1240, status: "Published", revenue: "$12,400" },
        { title: "Next.js for Enterprise", students: 850, status: "Draft", revenue: "$0" },
    ];

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 mesh-gradient min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">My Courses (Instructor)</h2>
                    <p className="text-muted-foreground">Manage your curriculum and content.</p>
                </div>
                <Link href="/teach/courses/create">
                    <Button className="bg-accent-cyan hover:bg-accent-cyan/90 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Create New Course
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {courses.map((course) => (
                    <Card key={course.title} className="glass border-none">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center text-accent-cyan">
                                    <BookOpen className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">{course.title}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className={course.status === 'Published' ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-amber-500 border-amber-500/20 bg-amber-500/5'}>
                                            {course.status}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">{course.students} Students</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <div className="font-bold text-lg">{course.revenue}</div>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Revenue Earned</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="hover:bg-white/10"><Edit className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="hover:bg-red-500/10 hover:text-red-500"><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
