import { NextResponse } from "next/server";
import { extractPdfFileContent } from "@/utils/pdf-parser";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    const text = await extractPdfFileContent(url);

    return NextResponse.json({ text });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to extract" }, { status: 500 });
  }
}