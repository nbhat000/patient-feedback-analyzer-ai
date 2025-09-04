import { NextRequest, NextResponse } from "next/server";
import { AnalyzeInput, type Submission, type Insight } from "@/app/lib/insight";
import { analyzeWithLLM } from "@/app/lib/llm";
import { saveSubmission } from "@/app/lib/store";
import { randomUUID } from "crypto"; // optional, but explicit

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { text } = AnalyzeInput.parse(body);

        const started = Date.now();

        let insights: Insight;
        try {
            insights = await analyzeWithLLM(text);
        } catch {
            // Fallback if LLM fails badly
            insights = {
                sentiment: "neutral",
                key_topics: [] as string[],
                action_required: false,
                summary: "Unable to analyze this feedback.",
            };
        }

        const latencyMs = Date.now() - started;

        const submission: Submission = {
            id: randomUUID(), // or crypto.randomUUID()
            createdAt: new Date().toISOString(),
            latencyMs,
            text,
            insights,
        };

        await saveSubmission(submission);

        return NextResponse.json({
            id: submission.id,
            createdAt: submission.createdAt,
            latencyMs: submission.latencyMs,
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
