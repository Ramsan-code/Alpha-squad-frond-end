"use client"

import { ArrowLeft, Save, Sparkles, Wand2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default function CreateCoursePage() {
    return (
        <div className="flex-1 space-y-8 p-8 pt-6 mesh-gradient min-h-screen">
            <div className="flex items-center justify-between">
                <Link href="/teach/courses">
                    <Button variant="ghost" className="text-muted-foreground hover:text-white">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
                    </Button>
                </Link>
                <div className="flex gap-2">
                    <Button variant="outline" className="glass">
                        <Save className="mr-2 h-4 w-4" /> Save Draft
                    </Button>
                    <Button className="bg-accent-vibrant hover:bg-accent-vibrant/90 text-white">
                        Publish Course
                    </Button>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card className="glass border-none">
                        <CardHeader>
                            <CardTitle>Course Information</CardTitle>
                            <CardDescription>Basic details about your masterclass.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Course Title</Label>
                                <Input placeholder="e.g. Mastering Next.js Server Components" className="glass" />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea placeholder="What will students learn?" className="h-32 glass" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass border-none">
                        <CardHeader>
                            <CardTitle>Curriculum Builder</CardTitle>
                            <CardDescription>Organize your lessons and modules.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
                            <p className="text-muted-foreground mb-4 font-medium italic">&quot;Use AI to generate a curriculum outline based on your title.&quot;</p>
                            <Button className="bg-accent-cyan hover:bg-accent-cyan/90 text-white">
                                <Wand2 className="mr-2 h-4 w-4" /> Generate with AI
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="glass border-accent-vibrant/20 bg-accent-vibrant/5">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-accent-vibrant" />
                                AI Assistance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Our AI recommends a price point of **$69.99** based on similar courses in the market and current demand for this topic.
                            </p>
                            <div className="space-y-2">
                                <Label className="text-xs">Suggested Price</Label>
                                <Input placeholder="$69.99" className="glass h-8 text-sm" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
