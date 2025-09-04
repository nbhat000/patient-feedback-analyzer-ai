"use client";
import { useState } from "react";
import FeedbackForm from "@/app/ui/components/FeedbackForm";
import HistoryList from "@/app/ui/components/HistoryList";
import InsightCard from "@/app/ui/components/InsightCard";
import Metrics from "@/app/ui/components/Metrics";

export default function Page() {
  const [lastResult, setLastResult] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const onAnalyze = async (text: string) => {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Failed");

    setLastResult(data);
    setSelectedId(data.id);
    setRefreshKey((v) => v + 1);
  };

  return (
    <main className="max-w-6xl mx-auto p-6 grid grid-cols-12 gap-6">
      <section className="col-span-5 space-y-6">
        <div className="bg-white border rounded-lg p-4">
          <h2 className="font-semibold mb-2 text-gray-900">Submit Feedback</h2>
          <FeedbackForm onAnalyze={onAnalyze} />
        </div>

        <div className="bg-white border rounded-lg p-4">
          <h2 className="font-semibold mb-2 text-gray-900">History</h2>
          <HistoryList refreshKey={refreshKey} onSelect={(id) => setSelectedId(id)} />
        </div>
      </section>

      <section className="col-span-7 space-y-6">
        <InsightCard data={lastResult} />
        <Metrics refreshKey={refreshKey} />
      </section>
    </main>
  );
}
