import { InsightSchema, type Insight } from "./insight";

const useMock = !process.env.OPENAI_API_KEY;

export async function analyzeWithLLM(text: string): Promise<Insight> {
    if (useMock) {
        // Simple deterministic mock
        const t = text.toLowerCase();
        const sentiment =
            /\b(terrible|awful|bad|rude|dirty|unacceptable)\b/.test(t) ? "negative" :
                /\b(great|excellent|amazing|love|wonderful|helpful)\b/.test(t) ? "positive" :
                    "neutral";

        const mock = {
            sentiment,
            key_topics: ["staff", "wait time", "communication"].slice(0, 3),
            action_required: sentiment !== "positive",
            summary: "Brief summary of the feedback with any notable issues.",
        };
        return InsightSchema.parse(mock);
    }

    const { OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `Analyze this customer feedback and return JSON with:
- sentiment: positive/neutral/negative
- key_topics: array of 3-5 main topics
- action_required: boolean
- summary: one sentence summary

Only return valid JSON. Feedback:
"""${text}"""`;

    const res = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0,
        messages: [{ role: "user", content: prompt }],
    });

    const raw = res.choices[0]?.message?.content ?? "{}";
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");
    const safe = jsonStart >= 0 ? raw.slice(jsonStart, jsonEnd + 1) : "{}";

    // Guardrail parse
    return InsightSchema.parse(JSON.parse(safe));
}
