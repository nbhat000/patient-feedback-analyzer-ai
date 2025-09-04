"use client";

export default function InsightCard({ data }: { data?: any }) {
    if (!data) {
        return (
            <div className="bg-white border rounded-lg p-4 text-sm text-gray-500">
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
                <h3 className="text-black font-semibold">Insights</h3>
                <span className={`text-xs px-2 py-1 rounded ${badge}`}>
                    {ins.sentiment}
                </span>
            </div>
            <p className="text-black text-sm">{ins.summary}</p>
            <div className="flex gap-2 flex-wrap">
                {ins.key_topics.map((t: string) => (
                    <span
                        key={t}
                        className="text-black text-xs bg-blue-50 border border-blue-200 px-2 py-1 rounded"
                    >
                        {t}
                    </span>
                ))}
            </div>
            <div className="text-black  text-[11px] text-gray-500">
                Analyzed at {new Date(data.createdAt).toLocaleString()}
            </div>
        </div>
    );
}
