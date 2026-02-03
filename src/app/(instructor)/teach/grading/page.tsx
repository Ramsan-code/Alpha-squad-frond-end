import { AutomatedGrader } from "@/components/automated-grader"
import { Separator } from "@/components/ui/separator"

export default function AutomatedGradingPage() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">AI Automated Grading</h2>
                <p className="text-muted-foreground">
                    Get instant feedback and grades for student submissions.
                </p>
            </div>
            <Separator />
            <AutomatedGrader />
        </div>
    )
}
