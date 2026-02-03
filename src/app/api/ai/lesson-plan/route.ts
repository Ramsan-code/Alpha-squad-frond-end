import { NextResponse } from "next/server";

const MOCKED_LESSON_PLAN = {
    title: "Introduction to Fractions",
    duration: "45 minutes",
    objectives: [
        "Understand the concept of a fraction as a part of a whole.",
        "Identify the numerator and denominator.",
        "Represent fractions using visual models.",
    ],
    materials: [
        "Fraction circles",
        "Whiteboard and markers",
        "Worksheets",
    ],
    procedure: [
        {
            time: "5 min",
            activity: "Introduction: Ask students if they have ever shared a pizza or a cake. Explain that fractions are used to describe parts of a whole.",
        },
        {
            time: "15 min",
            activity: "Direct Instruction: Define numerator and denominator. Show examples using fraction circles.",
        },
        {
            time: "15 min",
            activity: "Guided Practice: Have students shade in parts of shapes to represent given fractions.",
        },
        {
            time: "10 min",
            activity: "Independent Practice: Students complete a worksheet identifying fractions.",
        },
    ],
    assessment: "Check worksheets for accuracy. Ask exit ticket question: 'What does the bottom number in a fraction tell us?'",
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { subject, topic, gradeLevel, duration } = body;

        // Simulate AI delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // In a real app, we would call OpenAI/Gemini here using the input
        console.log("Generating lesson plan for:", { subject, topic, gradeLevel, duration });

        return NextResponse.json(MOCKED_LESSON_PLAN);
    } catch (error) {
        console.error("Error generating lesson plan:", error);
        return NextResponse.json(
            { error: "Failed to generate lesson plan" },
            { status: 500 }
        );
    }
}
