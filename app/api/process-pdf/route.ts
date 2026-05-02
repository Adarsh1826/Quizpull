import { NextResponse } from "next/server";
import { extractAndChunkPdf, PdfChunk } from "@/utils/pdf-chunker";
import { buildPrompt } from "@/prompt/prompt";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 60;

async function generateQuestionsFromChunk(
  chunk: PdfChunk
): Promise<any[]> {
  const prompt = buildPrompt(
    `[Chunk ${chunk.chunkIndex + 1} of ${chunk.totalChunks} — Pages ${chunk.startPage}–${chunk.endPage}]\n\n${chunk.text}`,
    10
  );

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error on chunk ${chunk.chunkIndex}: ${err}`);
  }

  const data = await res.json();
  let raw: string = data.choices?.[0]?.message?.content || "";

  if (!raw) {
    console.warn(`[process-pdf] Empty LLM response for chunk ${chunk.chunkIndex}`);
    return [];
  }

  // Strip markdown fences if present
  raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

  // Extract the JSON object
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) {
    console.warn(`[process-pdf] No JSON found in chunk ${chunk.chunkIndex} response`);
    return [];
  }

  try {
    const jsonString = match[0]
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]")
      .replace(/[""]/g, '"');

    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed.questions) ? parsed.questions : [];
  } catch (err) {
    console.error(`[process-pdf] JSON parse failed for chunk ${chunk.chunkIndex}:`, err);
    return [];
  }
}

export async function POST(req: Request) {
  try {
    const { url, fileId } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "Missing url" }, { status: 400 });
    }

    // ── STEP 1: Extract pages and build chunks (10 pages each) ──
    console.log("[process-pdf] Starting chunked extraction for:", url);
    const { chunks, totalPages } = await extractAndChunkPdf(url, 10);

    if (chunks.length === 0) {
      return NextResponse.json(
        { error: "No readable text found in PDF" },
        { status: 422 }
      );
    }

    console.log(`[process-pdf] Processing ${chunks.length} chunks (${totalPages} pages total)`);

    // ── STEP 2: Call LLM for each chunk sequentially ──
    const allQuestions: any[] = [];
    let chunkTitle = "Quiz";

    for (const chunk of chunks) {
      console.log(
        `[process-pdf] Processing chunk ${chunk.chunkIndex + 1}/${chunk.totalChunks} (pages ${chunk.startPage}–${chunk.endPage})`
      );
      try {
        const questions = await generateQuestionsFromChunk(chunk);
        allQuestions.push(...questions);
        console.log(
          `[process-pdf] Chunk ${chunk.chunkIndex + 1}: got ${questions.length} questions`
        );
      } catch (chunkErr) {
        // Log but don't abort — skip the failing chunk
        console.error(
          `[process-pdf] Chunk ${chunk.chunkIndex + 1} failed, skipping:`,
          chunkErr
        );
      }
    }

    if (allQuestions.length === 0) {
      return NextResponse.json(
        { error: "LLM produced no questions for this PDF" },
        { status: 500 }
      );
    }

    // ── STEP 3: Re-number question IDs (each chunk starts from 1) ──
    const renumbered = allQuestions.map((q, idx) => ({
      ...q,
      id: idx + 1,
    }));

    const mergedQuiz = {
      quiz_title: chunkTitle,
      questions: renumbered,
      meta: {
        totalPages,
        totalChunks: chunks.length,
        totalQuestions: renumbered.length,
      },
    };

    // ── STEP 4: Save to Supabase if fileId is provided ──
    if (fileId) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! 
      );

      const { error: dbError } = await supabase
        .from("pdfs")
        .update({ questions: mergedQuiz })
        .eq("id", Number(fileId));

      if (dbError) {
        console.error("[process-pdf] DB save error:", dbError.message);
        // Return the quiz anyway so the client can still use it
      } else {
        console.log(`[process-pdf] Saved ${renumbered.length} questions for file ${fileId}`);
      }
    }

    return NextResponse.json(mergedQuiz);
  } catch (err) {
    console.error("[process-pdf] Fatal error:", err);
    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 }
    );
  }
}


// import { NextResponse } from "next/server";
// import { extractAndChunkPdf, PdfChunk } from "@/utils/pdf-chunker";
// import { buildPrompt } from "@/prompt/prompt";
// import { createClient } from "@supabase/supabase-js";

// export const maxDuration = 60;

// // ─────────────────────────────────────────────────────────
// //  Scale questions per chunk based on total PDF page count
// //
// //  Small PDF  (≤10 pages)  → 5  questions per chunk
// //  Medium PDF (11-30)      → 8  questions per chunk
// //  Large PDF  (31-60)      → 12 questions per chunk
// //  XL PDF     (>60 pages)  → 15 questions per chunk
// // ─────────────────────────────────────────────────────────
// function getQuestionsPerChunk(totalPages: number): number {
//   if (totalPages <= 10) return 5;
//   if (totalPages <= 30) return 8;
//   if (totalPages <= 60) return 12;
//   return 15;
// }

// // ─────────────────────────────────────────────────────────
// //  Call Groq LLM for one chunk
// // ─────────────────────────────────────────────────────────
// async function generateQuestionsFromChunk(
//   chunk: PdfChunk,
//   questionsPerChunk: number
// ): Promise<any[]> {
//   const prompt = buildPrompt(
//     `[Chunk ${chunk.chunkIndex + 1} of ${chunk.totalChunks} — Pages ${chunk.startPage}–${chunk.endPage}]\n\n${chunk.text}`,
//     questionsPerChunk   // ← pass target count to prompt
//   );

//   const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//     },
//     body: JSON.stringify({
//       model: "llama-3.3-70b-versatile",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.3,
//     }),
//   });

//   if (!res.ok) {
//     const err = await res.text();
//     throw new Error(`Groq API error on chunk ${chunk.chunkIndex}: ${err}`);
//   }

//   const data = await res.json();
//   let raw: string = data.choices?.[0]?.message?.content || "";
//   if (!raw) return [];

//   raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();
//   const match = raw.match(/\{[\s\S]*\}/);
//   if (!match) return [];

//   try {
//     const jsonString = match[0]
//       .replace(/,\s*}/g, "}")
//       .replace(/,\s*]/g, "]")
//       .replace(/[""]/g, '"');
//     const parsed = JSON.parse(jsonString);
//     return Array.isArray(parsed.questions) ? parsed.questions : [];
//   } catch {
//     console.error(`[process-pdf] JSON parse failed for chunk ${chunk.chunkIndex}`);
//     return [];
//   }
// }

// // ─────────────────────────────────────────────────────────
// //  POST /api/process-pdf
// // ─────────────────────────────────────────────────────────
// export async function POST(req: Request) {
//   try {
//     const { url, fileId } = await req.json();
//     if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

//     // Step 1 — Extract pages and chunk (10 pages per chunk)
//     const { chunks, totalPages } = await extractAndChunkPdf(url, 10);
//     if (chunks.length === 0) {
//       return NextResponse.json({ error: "No readable text found in PDF" }, { status: 422 });
//     }

//     // Step 2 — Decide how many questions per chunk based on PDF size
//     const questionsPerChunk = getQuestionsPerChunk(totalPages);
//     console.log(
//       `[process-pdf] ${totalPages} pages → ${chunks.length} chunks → ${questionsPerChunk} questions/chunk → ~${chunks.length * questionsPerChunk} total`
//     );

//     // Step 3 — Call LLM for each chunk
//     const allQuestions: any[] = [];
//     for (const chunk of chunks) {
//       console.log(
//         `[process-pdf] Chunk ${chunk.chunkIndex + 1}/${chunk.totalChunks} (pages ${chunk.startPage}–${chunk.endPage})`
//       );
//       try {
//         const questions = await generateQuestionsFromChunk(chunk, questionsPerChunk);
//         allQuestions.push(...questions);
//         console.log(`[process-pdf] Chunk ${chunk.chunkIndex + 1}: got ${questions.length} questions`);
//       } catch (chunkErr) {
//         console.error(`[process-pdf] Chunk ${chunk.chunkIndex + 1} failed, skipping:`, chunkErr);
//       }
//     }

//     if (allQuestions.length === 0) {
//       return NextResponse.json({ error: "LLM produced no questions" }, { status: 500 });
//     }

//     // Step 4 — Re-number IDs
//     const renumbered = allQuestions.map((q, idx) => ({ ...q, id: idx + 1 }));

//     const mergedQuiz = {
//       quiz_title: "Generated Quiz",
//       questions: renumbered,
//       meta: {
//         totalPages,
//         totalChunks: chunks.length,
//         questionsPerChunk,
//         totalQuestions: renumbered.length,
//       },
//     };

//     // Step 5 — Save to Supabase
//     if (fileId) {
//       const supabase = createClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.SUPABASE_SERVICE_ROLE_KEY!
//       );
//       const { error: dbError } = await supabase
//         .from("pdfs")
//         .update({ questions: mergedQuiz })
//         .eq("id", fileId);
//       if (dbError) console.error("[process-pdf] DB save error:", dbError.message);
//     }

//     return NextResponse.json(mergedQuiz);
//   } catch (err) {
//     console.error("[process-pdf] Fatal error:", err);
//     return NextResponse.json({ error: "Failed to process PDF" }, { status: 500 });
//   }
// }