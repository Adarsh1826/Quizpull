"use server";

export async function extractPdfFileContent(url: string): Promise<string> {
  try {
    console.log("[pdf-parser] Fetching URL:", url);
    const pdfjs = require("pdfjs-dist/legacy/build/pdf");

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);

    const loadingTask = pdfjs.getDocument({
      data,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    });

    const pdfDoc = await loadingTask.promise;
    const pageTexts: string[] = [];

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const content = await page.getTextContent();
      const text = content.items
        .map((item: any) => ("str" in item ? item.str : ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      pageTexts.push(text);
    }

    const fullText = pageTexts.join("\n\n");
    console.log(`[pdf-parser] Extracted ${fullText.length} chars from ${pdfDoc.numPages} pages`);
    return fullText;
  } catch (error) {
    console.error("[pdf-parser] Extract error:", error);
    return "";
  }
}