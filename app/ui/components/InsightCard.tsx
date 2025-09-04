"use client";
import type { Submission } from "@/app/lib/insight";

export default function InsightCard({ data }: { data?: any }) {
    if (!data) {
        return (
            <div className="bg-white border rounded-lg p-4 text-sm text-gray-500">
                Submit feedback to see insights here.
            </div>
        );
    }

    const ins = data.insights;

    return (
        <div className="bg-white border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-black font-semibold">Insights</h3>
                <span className="text-xs px-2 py-1 rounded bg-gray-100">
                    {ins.sentiment}
                </span>
            </div>
            <p className="text-black text-sm">{ins.summary}</p>
            <div className="text-black text-xs">
                Topics: {ins.key_topics.join(", ")}
            </div>
            <div className="text-black text-xs">
                Action required: {ins.action_required ? "Yes" : "No"}
            </div>
        </div>
    );
}
