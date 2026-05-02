
export interface PdfChunk {
  chunkIndex: number;
  totalChunks: number;
  startPage: number;
  endPage: number;
  text: string;
  pageCount: number;
}

export interface ChunkResult {
  chunks: PdfChunk[];
  totalPages: number;
}

export async function extractPdfPages(url: string): Promise<string[]> {
  console.log("[chunker] Fetching PDF:", url);

  const pdfjs = require("pdfjs-dist/legacy/build/pdf");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);

  const loadingTask = pdfjs.getDocument({
    data,
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true,
  });

  const pdfDoc = await loadingTask.promise;
  const numPages: number = pdfDoc.numPages;
  console.log(`[chunker] Total pages: ${numPages}`);

  const pages: string[] = [];

  for (let i = 1; i <= numPages; i++) {
    try {
      const page = await pdfDoc.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => ("str" in item ? item.str : ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      pages.push(pageText);
    } catch (pageErr) {
      console.warn(`[chunker] Skipping page ${i}:`, pageErr);
      pages.push("");
    }
  }

  return pages;
}

export function buildChunks(pages: string[], chunkSize = 10): ChunkResult {
  const totalPages = pages.length;
  const indexed = pages.map((text, i) => ({ index: i, text: text.trim() }));
  const chunks: PdfChunk[] = [];

  for (let i = 0; i < indexed.length; i += chunkSize) {
    const slice = indexed.slice(i, i + chunkSize);

    const joinedText = slice
      .filter((p) => p.text.length > 20)
      .map((p) => p.text)
      .join("\n\n--- Page Break ---\n\n");

    if (joinedText.trim().length < 50) continue;

    chunks.push({
      chunkIndex: chunks.length,
      totalChunks: 0,
      startPage: slice[0].index + 1,
      endPage: slice[slice.length - 1].index + 1,
      text: joinedText,
      pageCount: slice.length,
    });
  }

  const totalChunks = chunks.length;
  chunks.forEach((c) => (c.totalChunks = totalChunks));

  console.log(`[chunker] ${totalChunks} chunks from ${totalPages} pages`);
  return { chunks, totalPages };
}

export async function extractAndChunkPdf(
  url: string,
  chunkSize = 10
): Promise<ChunkResult> {
  const pages = await extractPdfPages(url);
  return buildChunks(pages, chunkSize);
}