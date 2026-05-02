import { NextResponse } from "next/server";
import { buildPrompt } from "@/prompt/prompt";

export async function fetchLLM(prompt: string): Promise<string> {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
        }),
    });

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content || "";
    if (!raw) throw new Error("Empty response from Groq");
    return raw;
}

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text || text.trim().length < 20) {
            return NextResponse.json(
                { error: "No valid text provided" },
                { status: 400 }
            );
        }

        const prompt = buildPrompt(text, 0);
        let raw = await fetchLLM(prompt);

        raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

        const match = raw.match(/\{[\s\S]*\}/);
        if (!match) throw new Error("No JSON found in response");

        let jsonString = match[0]
            .replace(/,\s*}/g, "}")
            .replace(/,\s*]/g, "]")
            .replace(/[""]/g, '"');

        let quiz;
        try {
            quiz = JSON.parse(jsonString);
        } catch (err) {
            console.error("Invalid JSON:\n", jsonString);
            throw new Error("Invalid JSON: " + (err as Error).message);
        }

        return NextResponse.json(quiz);

    } catch (err) {
        console.error("LLM API Error:", err);
        return NextResponse.json(
            { error: "Failed to generate quiz" },
            { status: 500 }
        );
    }
}