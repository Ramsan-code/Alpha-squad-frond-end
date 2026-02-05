"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Loader2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"

import { api } from "@/lib/api/client"

interface GradingResult {
    score: number
    feedback: string
    improvements: string[]
}

export function AutomatedGrader() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<GradingResult | null>(null)
    const [formData, setFormData] = useState({
        description: "",
        submission: "",
    })

    const handleGrade = async () => {
        if (!formData.description || !formData.submission) {
            toast.error("Please provide both assignment description and student submission")
            return
        }

        setLoading(true)
        setResult(null)

        try {
            const response = await api.post<any>("/ai/grade", {
                assignmentDescription: formData.description,
                studentSubmission: formData.submission,
            })

            setResult(response.data || response) // API client might return data directly or wrapped
            toast.success("Grading completed!")
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Assignment Details</CardTitle>
                        <CardDescription>
                            Provide the context and the student&apos;s work for AI analysis.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="desc">Assignment Description / Prompt</Label>
                            <Textarea
                                id="desc"
                                placeholder="Describe what the student was supposed to do..."
                                className="h-24 resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="submission">Student Submission</Label>
                            <Textarea
                                id="submission"
                                placeholder="Paste the student's text here..."
                                className="h-64 resize-none font-mono text-sm"
                                value={formData.submission}
                                onChange={(e) => setFormData({ ...formData, submission: e.target.value })}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={handleGrade}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Grade Submission
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="space-y-6">
                {result ? (
                    <Card className="border-blue-500/20 bg-blue-500/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex justify-between items-center">
                                <span>Grading Report</span>
                                <span className={`text-2xl font-bold ${result.score >= 90 ? "text-green-500" :
                                    result.score >= 70 ? "text-yellow-500" : "text-red-500"
                                    }`}>
                                    {result.score}/100
                                </span>
                            </CardTitle>
                            <Progress value={result.score} className="h-2" />
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div>
                                <h4 className="flex items-center font-semibold mb-2 text-foreground">
                                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                                    Feedback
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {result.feedback}
                                </p>
                            </div>

                            <div>
                                <h4 className="flex items-center font-semibold mb-2 text-foreground">
                                    <AlertCircle className="mr-2 h-4 w-4 text-orange-500" />
                                    Areas for Improvement
                                </h4>
                                <ul className="space-y-2">
                                    {result.improvements.map((item, i) => (
                                        <li key={i} className="text-sm text-muted-foreground flex gap-2">
                                            <span className="text-orange-500 select-none">•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="h-full flex items-center justify-center p-12 border-2 border-dashed rounded-lg text-muted-foreground bg-accent/5">
                        <div className="text-center space-y-2">
                            <Sparkles className="h-10 w-10 mx-auto opacity-20" />
                            <p>Grading results will appear here</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
