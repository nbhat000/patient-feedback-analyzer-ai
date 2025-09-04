"use client";
import type { AnalysisResult } from "@/app/lib/mockClient";

export default function HistoryList({
    items,
    onSelect,
}: {
    items: AnalysisResult[];
    onSelect: (id: string) => void;
}) {
    if (!items.length) {
        return <p className="text-sm text-gray-500">No submissions yet.</p>;
    }

    return (
        <ul className="space-y-2">
            {items.map((it) => {
                let sentimentClass = "bg-white";
                if (it.insights.sentiment === "positive") {
                    sentimentClass = "bg-green-50 border-green-200";
                } else if (it.insights.sentiment === "negative") {
                    sentimentClass = "bg-red-50 border-red-200";
                }

                return (
                    <li key={it.id}>
                        <button
                            onClick={() => onSelect(it.id)}
                            className={`w-full text-left p-3 border rounded-md hover:opacity-90 transition ${sentimentClass}`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-black text-xs uppercase tracking-wide">
                                    {it.insights.sentiment}
                                </span>
                                <span className="text-black text-xs text-gray-500">
                                    {new Date(it.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <div className="text-black text-sm whitespace-normal">
                                {it.insights.summary || "No summary"}
                            </div>
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}
