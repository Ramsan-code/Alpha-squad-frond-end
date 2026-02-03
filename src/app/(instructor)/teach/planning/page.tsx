import { LessonPlanner } from "@/components/lesson-planner"
import { Separator } from "@/components/ui/separator"

export default function LessonPlanningPage() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Lesson Plan Generator</h2>
                <p className="text-muted-foreground">
                    Generate structured lesson plans instantly with AI assistance.
                </p>
            </div>
            <Separator />
            <LessonPlanner />
        </div>
    )
}
