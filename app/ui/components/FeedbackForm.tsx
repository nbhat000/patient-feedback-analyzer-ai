"use client";
import { useState } from "react";

export default function FeedbackForm({
    onAnalyze,
}: {
    onAnalyze: (text: string) => Promise<void>;
}) {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const handleSubmit = async () => {
        setErr("");
        if (text.trim().length < 5) {
            setErr("Please enter at least 5 characters.");
            return;
        }
        setLoading(true);
        try {
            await onAnalyze(text);
            setText("");
        } catch (e: any) {
            setErr(e?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-2">
            <textarea
                className="w-full h-40 p-3 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Paste patient feedback..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{text.length} chars</span>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                >
                    {loading ? "Analyzing..." : "Analyze"}
                </button>
            </div>
            {err ? <p className="text-sm text-red-600">{err}</p> : null}
        </div>
    );
}
