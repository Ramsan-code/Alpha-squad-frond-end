import { NextResponse } from "next/server";

const MOCKED_GRADING_RESULT = {
    score: 85,
    feedback: "Good effort! You have a clear introduction and conclusion. However, your second paragraph needs more supporting evidence. Watch out for run-on sentences.",
    improvements: [
        "Provide more specific examples to support your arguments in the body paragraphs.",
        "Break down long sentences to improve readability.",
        "Check for subject-verb agreement in the third paragraph.",
    ],
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { studentSubmission } = body;

        // Simulate AI delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // In a real app, we would call OpenAI/Gemini here
        console.log("Grading submission:", { len: studentSubmission.length });

        return NextResponse.json(MOCKED_GRADING_RESULT);
    } catch (error) {
        console.error("Error grading submission:", error);
        return NextResponse.json(
            { error: "Failed to grade submission" },
            { status: 500 }
        );
    }
}
