import { NextRequest, NextResponse } from "next/server";
import { AnalyzeInput, type Submission, type Insight } from "@/app/lib/insight";
import { analyzeWithLLM } from "@/app/lib/llm";
import { saveSubmission } from "@/app/lib/store";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { text } = AnalyzeInput.parse(body);

        const insights = await analyzeWithLLM(text);

        const submission: Submission = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            text,
            insights,
        };

        await saveSubmission(submission);

        return NextResponse.json({
            id: submission.id,
            createdAt: submission.createdAt,
            insights: submission.insights,
            sentiment: submission.insights.sentiment,
        });
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message ?? "Invalid request" },
            { status: 400 }
        );
    }
}
