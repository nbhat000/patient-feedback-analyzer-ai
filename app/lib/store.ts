import fs from "fs";
import path from "path";
import type { Submission } from "./insight";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "feedback.jsonl");

function ensureFile() {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "");
}

export async function saveSubmission(sub: Submission) {
    ensureFile();
    const line = JSON.stringify(sub) + "\n";
    await fs.promises.appendFile(FILE, line, "utf8");
}

export async function listSubmissions(limit = 50): Promise<Submission[]> {
    ensureFile();
    const txt = await fs.promises.readFile(FILE, "utf8");
    const lines = txt.trim() ? txt.trim().split("\n") : [];

    const arr: Submission[] = [];
    for (const line of lines) {
        try {
            const parsed = JSON.parse(line);
            arr.push(parsed as Submission);
        } catch (e) {
            console.warn("Skipping malformed JSON line:", line);
        }
    }

    // newest first
    return arr.reverse().slice(0, limit);
}
