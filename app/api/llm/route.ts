import { NextResponse } from "next/server";
import { buildPrompt } from "@/prompt/prompt";

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text || text.trim().length < 20) {
            return NextResponse.json(
                { error: "No valid text provided" },
                { status: 400 }
            );
        }

        const prompt = buildPrompt(text);

        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [{ text: prompt }],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.3
                    }
                })
            }
        );

        const data = await res.json();
        console.log(data);


        let raw =
            data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        if (!raw) {
            throw new Error("Empty response from Gemini");
        }

        
        raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

        const match = raw.match(/\{[\s\S]*\}/);

        if (!match) {
            throw new Error("No JSON found in Gemini response");
        }

        let jsonString = match[0];

        
        jsonString = jsonString
            .replace(/,\s*}/g, "}") // trailing commas in objects
            .replace(/,\s*]/g, "]") // trailing commas in arrays
            .replace(/[“”]/g, '"'); // smart quotes

        
        let quiz;
        try {
            quiz = JSON.parse(jsonString);
        } catch (err) {
            console.error("Invalid JSON from Gemini:\n", jsonString);
            throw new Error("Failed to parse quiz JSON");
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