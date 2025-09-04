"use client";
import type { AnalysisResult } from "@/app/lib/mockClient";

export default function InsightCard({ data }: { data?: AnalysisResult }) {
    if (!data) {
        return (
            <div className="bg-white border rounded-lg p-4 text-sm text-gray-500">
                <h2 className="text-black font-semibold mb-2">Insights</h2>

                Submit feedback to see insights here.
            </div>
        );
    }

    const ins = data.insights;

    const badge =
        ins.sentiment === "positive"
            ? "bg-green-100 text-green-800"
            : ins.sentiment === "negative"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800";

    return (
        <div className="bg-white border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold">Insights</h3>
                <span className={`text-xs px-2 py-1 rounded ${badge}`}>
                    {ins.sentiment}
                </span>
            </div>
            <p className="text-sm">{ins.summary}</p>
            <div className="flex gap-2 flex-wrap">
                {ins.key_topics.map((t) => (
                    <span
                        key={t}
                        className="text-xs bg-blue-50 border border-blue-200 px-2 py-1 rounded"
                    >
                        {t}
                    </span>
                ))}
            </div>
            <div className="text-xs">
                Action required: <strong>{ins.action_required ? "Yes" : "No"}</strong>
            </div>
            <div className="text-[11px] text-gray-500">
                Analyzed at {new Date(data.createdAt).toLocaleString()}
            </div>
            <details className="text-xs">
                <summary className="cursor-pointer">Raw JSON</summary>
                <pre className="mt-2 bg-gray-50 p-2 rounded overflow-auto">
                    {JSON.stringify(ins, null, 2)}
                </pre>
            </details>
        </div>
    );
}
