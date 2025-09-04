import { InsightSchema, type Insight } from "./insight";

export async function analyzeWithLLM(text: string): Promise<Insight> {
    const { OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `Analyze this customer feedback and return JSON with:
- sentiment: positive/neutral/negative
- key_topics: array of 3-5 main topics
- summary: one sentence summary

Only return valid JSON. Feedback:
"""${text}"""`;

    const res = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0,
        messages: [{ role: "user", content: prompt }],
    });

    const raw = res.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);

    // Ensure key_topics is never empty
    if (!parsed.key_topics || parsed.key_topics.length === 0) {
        parsed.key_topics = ["general feedback"];
    }

    return InsightSchema.parse(parsed);
}
