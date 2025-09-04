"use client";
import { useMemo, useState } from "react";
import FeedbackForm from "@/app/ui/components/FeedbackForm";
import InsightCard from "@/app/ui/components/InsightCard";
import HistoryList from "@/app/ui/components/HistoryList";
import { analyzeFeedbackMock, type AnalysisResult } from "@/app/lib/mockClient";

export default function Page() {
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const selected = useMemo(
    () => results.find((r) => r.id === selectedId) || results[0],
    [results, selectedId]
  );

  const onAnalyze = async (text: string) => {
    const res = await analyzeFeedbackMock(text); // swap for real data
    setResults((prev) => [res, ...prev]);
    setSelectedId(res.id);
  };

  return (
    <main className="max-w-6xl mx-auto p-6 grid grid-cols-12 gap-6">
      <section className="col-span-5 space-y-6">
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-black font-semibold mb-2">Submit Feedback</h2>
          <FeedbackForm onAnalyze={onAnalyze} />
        </div>
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-black font-semibold mb-2">History</h2>
          <HistoryList items={results} onSelect={(id) => setSelectedId(id)} />
        </div>
      </section>

      <section className="col-span-7 space-y-6">
        <InsightCard data={selected} />
      </section>
    </main>
  );
}
