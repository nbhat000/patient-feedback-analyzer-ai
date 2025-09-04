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
            {items.map((it) => (
                <li key={it.id}>
                    <button
                        onClick={() => onSelect(it.id)}
                        className="w-full text-left p-3 bg-white border rounded-md hover:bg-gray-50"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs uppercase tracking-wide">
                                {it.insights.sentiment}
                            </span>
                            <span className="text-xs text-gray-500">
                                {new Date(it.createdAt).toLocaleString()}
                            </span>
                        </div>
                        <div className="text-sm line-clamp-2">
                            {it.insights.summary || "No summary"}
                        </div>
                    </button>
                </li>
            ))}
        </ul>
    );
}
