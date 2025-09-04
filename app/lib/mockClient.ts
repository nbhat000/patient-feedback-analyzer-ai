export type Insight = {
    sentiment: "positive" | "neutral" | "negative";
    key_topics: string[];
    action_required: boolean;
    summary: string;
};

export type AnalysisResult = {
    id: string;
    createdAt: string;
    insights: Insight;
};

function classifySentiment(text: string): Insight["sentiment"] {
    const t = text.toLowerCase();
    if (t.match(/\b(terrible|awful|bad|rude|dirty|waited forever)\b/)) return "negative";
    if (t.match(/\b(great|excellent|amazing|love|wonderful|helpful)\b/)) return "positive";
    return "neutral";
}

export async function analyzeFeedbackMock(text: string): Promise<AnalysisResult> {
    // fake latency
    await new Promise(r => setTimeout(r, 600));
    const sentiment = classifySentiment(text);
    const topics = ["staff", "wait time", "facilities", "communication"];
    return {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        insights: {
            sentiment,
            key_topics: topics.slice(0, 3),
            action_required: sentiment !== "positive",
            summary: "One sentence summary of the feedback.",
        },
    };
}
