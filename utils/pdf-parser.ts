"use server";
import { extractText } from "unpdf";

export async function extractPdfFileContent(url: string): Promise<string> {
  try {
    console.log("1. Fetching URL:", url);

    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { text } = await extractText(buffer, { mergePages: true });

    console.log("Extracted text:", text);
    return text;

  } catch (error) {
    console.log("PDF extract error:", error);
    return "";
  }
}