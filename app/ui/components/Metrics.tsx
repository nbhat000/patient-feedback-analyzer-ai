"use client";
import { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from "recharts";

type MetricsPayload = {
    total: number;
    negativePct: number;
    topTopics: { name: string; count: number }[];
    sentiments: { positive: number; neutral: number; negative: number };
};

const COLORS = ["#10b981", "#9ca3af", "#ef4444"]; // green, gray, red

export default function Metrics({ refreshKey }: { refreshKey?: number }) {
    const [data, setData] = useState<MetricsPayload | null>(null);

    useEffect(() => {
        (async () => {
            const res = await fetch("/api/metrics", { cache: "no-store" });
            const json = await res.json();
            setData(json);
        })();
    }, [refreshKey]);

    if (!data) return <p className="text-sm text-gray-700">Loading metrics…</p>;

    const sentimentData = [
        { name: "Positive", value: data.sentiments.positive },
        { name: "Neutral", value: data.sentiments.neutral },
        { name: "Negative", value: data.sentiments.negative },
    ];

    return (
        <div className="space-y-4">
            {/* Cards */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-white border border-gray-200 rounded p-3">
                    <div className="text-xs text-gray-700">Total submissions</div>
                    <div className="text-2xl font-semibold text-gray-900">{data.total}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded p-3">
                    <div className="text-xs text-gray-700">% Negative feedback</div>
                    <div className="text-2xl font-semibold text-red-600">
                        {data.negativePct}%
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded p-3">
                    <div className="text-xs text-gray-700">Top topics</div>
                    <ul className="mt-2 space-y-1 text-sm text-gray-900">
                        {data.topTopics.map((t) => (
                            <li key={t.name}>
                                {t.name} <span className="text-gray-500">({t.count})</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Donut chart */}
            <div className="bg-white border border-gray-200 rounded p-3">
                <div className="text-sm font-medium text-gray-900 mb-2">
                    Sentiment distribution
                </div>
                <div style={{ width: "100%", height: 240 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={sentimentData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                label
                            >
                                {sentimentData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
