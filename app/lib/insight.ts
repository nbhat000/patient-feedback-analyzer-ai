import { z } from "zod";

export const AnalyzeInput = z.object({
    text: z.string().min(5, "Please enter at least 5 characters"),
});

export const InsightSchema = z.object({
    sentiment: z.enum(["positive", "neutral", "negative"]),
    key_topics: z.array(z.string()).max(5),
    action_required: z.boolean(),
    summary: z.string().min(1),
});

export type Insight = z.infer<typeof InsightSchema>;

export type Submission = {
    id: string;
    createdAt: string;  // ISO string
    text: string;
    insights: Insight;
};
