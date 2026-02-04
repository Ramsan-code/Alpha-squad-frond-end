"use client"

import * as React from "react"
import { useCourses } from "@/hooks/use-courses"
import { Search, Filter, BookOpen, Star, Clock, ArrowRight, Play, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

export default function BrowseCoursesPage() {
    const [searchQuery, setSearchQuery] = React.useState("")
    const [debouncedSearch, setDebouncedSearch] = React.useState("")
    const [category, setCategory] = React.useState<string | undefined>()

    // Debounce search
    React.useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const { courses, isLoading, total } = useCourses({
        search: debouncedSearch,
        category: category,
        limit: 12
    });

    const categories = ["Development", "AI/ML", "Design", "Business", "Marketing"];

    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Hero / Search Header */}
            <div className="relative rounded-[32px] overflow-hidden bg-zinc-900 border border-white/5 p-8 md:p-12 mesh-gradient">
                <div className="max-w-3xl space-y-4 relative z-10">
                    <Badge className="bg-accent-vibrant/20 text-accent-vibrant border-none px-3 py-1">Course Catalog</Badge>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                        Find your next <span className="text-accent-vibrant">Career Jump</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Browse over {total || 'thousands'} professional courses designed to help you master the most in-demand skills today.
                    </p>

                    <div className="pt-4 flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Search by title, topic, or instructor..."
                                className="pl-10 h-12 bg-black/40 border-white/10 focus:border-accent-vibrant transition-all rounded-xl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button className="h-12 px-8 bg-accent-vibrant hover:bg-accent-vibrant/90 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all hover:scale-105">
                            Search Courses
                        </Button>
                    </div>
                </div>

                {/* Visual element */}
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-accent-vibrant/10 to-transparent hidden lg:block" />
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-64 space-y-6">
                    <div className="space-y-4">
                        <h3 className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider text-muted-foreground">
                            <Filter className="h-4 w-4" /> Categories
                        </h3>
                        <div className="flex flex-wrap lg:flex-col gap-2">
                            <Button
                                variant={!category ? "secondary" : "ghost"}
                                size="sm"
                                className="justify-start h-9 rounded-lg"
                                onClick={() => setCategory(undefined)}
                            >
                                All Categories
                            </Button>
                            {categories.map((cat) => (
                                <Button
                                    key={cat}
                                    variant={category === cat ? "secondary" : "ghost"}
                                    size="sm"
                                    className="justify-start h-9 rounded-lg"
                                    onClick={() => setCategory(cat)}
                                >
                                    {cat}
                                </Button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 space-y-6">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing <span className="text-white font-bold">{courses.length}</span> of <span className="text-white font-bold">{total}</span> results
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-4 text-muted-foreground">
                            <Loader2 className="h-12 w-12 animate-spin text-accent-vibrant" />
                            <p className="animate-pulse">Loading catalog...</p>
                        </div>
                    ) : courses.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {courses.map((course: any) => (
                                <Card key={course._id} className="glass border-none overflow-hidden group hover:bg-white/[0.03] transition-all duration-300">
                                    <div className="relative aspect-video overflow-hidden">
                                        <Image
                                            src={course.thumbnail || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60"}
                                            alt={course.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute top-3 left-3">
                                            <Badge className="bg-black/60 text-white backdrop-blur-sm border-none">{course.category || 'General'}</Badge>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                                            <Link href={`/courses/${course._id}`}>
                                                <Button size="sm" className="bg-white text-black hover:bg-zinc-200 font-bold rounded-full">
                                                    View Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                    <CardContent className="p-5 space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-[10px] text-accent-cyan font-bold uppercase tracking-widest">
                                                <Star className="h-3 w-3 fill-current" /> 4.8 • Best Seller
                                            </div>
                                            <CardTitle className="text-lg font-bold leading-tight line-clamp-2">
                                                {course.title}
                                            </CardTitle>
                                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                {course.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-accent-vibrant/20 flex items-center justify-center text-[10px] font-bold text-accent-vibrant">
                                                    {course.teacherId?.firstName?.[0] || 'G'}
                                                </div>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {course.teacherId?.firstName ? `${course.teacherId.firstName} ${course.teacherId.lastName}` : 'Global Instructor'}
                                                </span>
                                            </div>
                                            <div className="text-lg font-black text-white">
                                                ${course.price}
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {course.duration || 10}h Content</span>
                                            <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {course.level || 'Beginner'}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="h-96 glass rounded-2xl flex flex-col items-center justify-center space-y-4 border-dashed border-white/10">
                            <div className="p-4 rounded-full bg-white/5">
                                <Search className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-bold">No courses found</h3>
                                <p className="text-muted-foreground">Try adjusting your search or filters to find what you&apos;re looking for.</p>
                            </div>
                            <Button variant="outline" onClick={() => { setSearchQuery(""); setCategory(undefined); }}>
                                Clear All Filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
