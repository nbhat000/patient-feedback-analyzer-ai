import { NextResponse } from "next/server";
import { listSubmissions } from "@/app/lib/store";

export async function GET() {
    const rows = await listSubmissions(50);
    const list = rows.map((r) => ({
        id: r.id,
        createdAt: r.createdAt,
        sentiment: r.insights.sentiment,
        summary: r.insights.summary,
    }));
    return NextResponse.json(list);
}
