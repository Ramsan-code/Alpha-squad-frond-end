"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, BookOpen, Clock, Target, Zap, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"

interface LessonPlan {
    title: string
    duration: string
    objectives: string[]
    materials: string[]
    procedure: { time: string; activity: string }[]
    assessment: string
}

export function LessonPlanner() {
    const [loading, setLoading] = useState(false)
    const [plan, setPlan] = useState<LessonPlan | null>(null)
    const [formData, setFormData] = useState({
        subject: "",
        topic: "",
        gradeLevel: "",
        duration: "45",
        style: "interactive" as "interactive" | "lecture" | "lab",
    })

    const handleGenerate = async () => {
        if (!formData.subject || !formData.topic || !formData.gradeLevel) {
            toast.error("Please fill in all fields")
            return
        }

        setLoading(true)
        setPlan(null)

        try {
            const response = await fetch("/api/ai/lesson-plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (!response.ok) throw new Error("Failed to generate plan")

            const data = await response.json()
            setPlan(data)
            toast.success("AI Lesson plan generated successfully!")
        } catch (error) {
            console.error(error)
            toast.error("AI node failure. Please retry.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-2 space-y-6">
                <Card className="glass border-white/10 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <Zap className="h-5 w-5 text-accent-vibrant animate-pulse" />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-2xl font-black tracking-tight">AI ARCHITECT</CardTitle>
                        <CardDescription>
                            Configure your pedagogical structure and let Alpha.AI build the curriculum.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="subject" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Core Discipline</Label>
                            <Input
                                id="subject"
                                placeholder="e.g. Theoretical Physics"
                                className="h-12 bg-white/5 border-white/10 focus:border-accent-vibrant transition-all"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="topic" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Module Focus</Label>
                            <Input
                                id="topic"
                                placeholder="e.g. Wave-Particle Duality"
                                className="h-12 bg-white/5 border-white/10 focus:border-accent-vibrant transition-all"
                                value={formData.topic}
                                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="grade" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Target Tier</Label>
                                <Select
                                    value={formData.gradeLevel}
                                    onValueChange={(val) => setFormData({ ...formData, gradeLevel: val })}
                                >
                                    <SelectTrigger id="grade" className="h-12 bg-white/5 border-white/10">
                                        <SelectValue placeholder="Level" />
                                    </SelectTrigger>
                                    <SelectContent className="glass">
                                        <SelectItem value="k-2">Foundation (K-2)</SelectItem>
                                        <SelectItem value="3-5">Intermediate (3-5)</SelectItem>
                                        <SelectItem value="6-8">Explorer (6-8)</SelectItem>
                                        <SelectItem value="9-12">Academic (9-12)</SelectItem>
                                        <SelectItem value="university">Expert (Uni)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Tempo (Min)</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    className="h-12 bg-white/5 border-white/10"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Delivery Style</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {["interactive", "lecture", "lab"].map((s) => (
                                    <Button
                                        key={s}
                                        variant="outline"
                                        size="sm"
                                        className={`h-10 capitalize transition-all ${formData.style === s ? 'bg-accent-vibrant text-white border-accent-vibrant' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                        onClick={() => setFormData({ ...formData, style: s as "interactive" | "lecture" | "lab" })}
                                    >
                                        {s}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                        <Button
                            className="w-full h-14 bg-accent-vibrant hover:bg-accent-vibrant/90 text-white font-black text-lg shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all hover:scale-[1.02]"
                            onClick={handleGenerate}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                    CONSTRUCTING...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-3 h-6 w-6" />
                                    GENERATE BLUEPRINT
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="lg:col-span-3 min-h-[500px]">
                {plan ? (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="h-full"
                    >
                        <Card className="h-full glass border-accent-vibrant/20 bg-accent-vibrant/[0.02] shadow-2xl flex flex-col">
                            <CardHeader className="border-b border-white/5 pb-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-3xl font-black text-white">{plan.title}</CardTitle>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center"><Clock className="mr-1.5 h-4 w-4 text-accent-cyan" /> {plan.duration} mins</span>
                                            <span className="flex items-center font-bold text-accent-vibrant uppercase tracking-widest text-[10px]">{formData.style} mode</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5">
                                        <BookOpen className="h-5 w-5" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-auto p-8 space-y-8 scrollbar-hide">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h4 className="flex items-center text-sm font-black uppercase tracking-widest text-accent-cyan">
                                            <Target className="mr-2 h-4 w-4" />
                                            Learning Objectives
                                        </h4>
                                        <ul className="space-y-3">
                                            {plan.objectives.map((obj, i) => (
                                                <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                                                    <span className="text-accent-vibrant font-black">0{i + 1}</span>
                                                    {obj}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="flex items-center text-sm font-black uppercase tracking-widest text-amber-500">
                                            <Zap className="mr-2 h-4 w-4" />
                                            Required Assets
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {plan.materials.map((mat, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold text-white uppercase tracking-tighter hover:border-accent-vibrant/50 transition-colors cursor-default">
                                                    {mat}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="flex items-center text-sm font-black uppercase tracking-widest text-accent-vibrant">Timeline & Procedure</h4>
                                    <div className="space-y-1 relative">
                                        <div className="absolute left-6 inset-y-0 w-px bg-gradient-to-b from-accent-vibrant/50 via-white/5 to-transparent" />
                                        {plan.procedure.map((step, i) => (
                                            <div key={i} className="relative flex gap-6 p-4 rounded-xl hover:bg-white/[0.02] transition-colors group">
                                                <div className="z-10 h-12 w-12 rounded-xl bg-zinc-900 border border-white/10 flex flex-col items-center justify-center min-w-[3rem] group-hover:border-accent-vibrant/50 transition-colors shadow-xl">
                                                    <span className="text-[10px] font-black text-accent-vibrant">{step.time}</span>
                                                </div>
                                                <div className="flex-1 pt-1">
                                                    <div className="text-sm font-bold text-white mb-0.5">Phase {i + 1}</div>
                                                    <p className="text-xs text-muted-foreground leading-relaxed">{step.activity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Card className="bg-zinc-900/50 border-white/5 p-6 rounded-3xl">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-green-500 mb-2">Outcome Validation</h4>
                                    <p className="text-sm text-zinc-400 italic font-medium leading-relaxed">&quot;{plan.assessment}&quot;</p>
                                </Card>
                            </CardContent>
                            <CardFooter className="border-t border-white/5 p-6 flex gap-3">
                                <Button className="flex-1 bg-white hover:bg-zinc-200 text-black font-bold">Lauch Virtual Classroom</Button>
                                <Button variant="outline" className="glass flex-1 font-bold">Export PDF</Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ) : (
                    <div className="h-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.01] group hover:bg-white/[0.02] transition-all">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-accent-vibrant/5 flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                                <BookOpen className="h-8 w-8 text-accent-vibrant opacity-30 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-muted-foreground/50">Await Architect Input</p>
                                <p className="text-[10px] text-muted-foreground/30 uppercase tracking-[0.2em]">Ready for Generation</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
