"use client";
import { useEffect, useState } from "react";

type Item = { id: string; createdAt: string; sentiment: string; summary: string };

export default function HistoryList({
    refreshKey,
    onSelect,
}: {
    refreshKey?: number | string;
    onSelect: (id: string) => void;
}) {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    async function load() {
        setErr("");
        setLoading(true);
        try {
            const res = await fetch("/api/feedback", { cache: "no-store" });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Failed to load history");
            setItems(data);
        } catch (e: any) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, [refreshKey]);

    if (err) return <p className="text-sm text-red-600">{err}</p>;
    if (loading) return <p className="text-sm text-gray-700">Loading…</p>;
    if (!items.length) return <p className="text-sm text-gray-700">No submissions yet.</p>;

    return (
        <ul className="space-y-2">
            {items.map((it) => {
                let sentimentClass = "bg-white border-gray-200";
                if (it.sentiment === "positive") sentimentClass = "bg-green-50 border-green-200";
                else if (it.sentiment === "negative") sentimentClass = "bg-red-50 border-red-200";

                return (
                    <li key={it.id}>
                        <button
                            onClick={() => onSelect(it.id)}
                            className={`w-full text-left p-3 border rounded-md hover:opacity-90 transition ${sentimentClass}`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs uppercase tracking-wide text-gray-900">{it.sentiment}</span>
                                <span className="text-xs text-gray-700">
                                    {new Date(it.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <div className="text-sm text-gray-900">
                                {it.summary || "No summary"}
                            </div>
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}
