import { NextResponse } from "next/server";
import { listSubmissions } from "@/app/lib/store";

export async function GET() {
    const rows = await listSubmissions(500);

    let negatives = 0, positives = 0, neutrals = 0;
    const topics: Record<string, number> = {};

    for (const r of rows) {
        if (r.insights.sentiment === "negative") negatives++;
        else if (r.insights.sentiment === "positive") positives++;
        else neutrals++;

        for (const t of r.insights.key_topics || []) {
            const key = t.trim().toLowerCase();
            if (!key) continue;
            topics[key] = (topics[key] || 0) + 1;
        }
    }

    const total = rows.length;
    const negativePct = total ? Math.round((negatives / total) * 100) : 0;

    const topTopics = Object.entries(topics)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

    return NextResponse.json({
        total,
        negativePct,
        topTopics,
        sentiments: { positive: positives, neutral: neutrals, negative: negatives },
    });
}
