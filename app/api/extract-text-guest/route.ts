import { extractText } from "unpdf";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ text: "" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { text } = await extractText(buffer, { mergePages: true });

    return Response.json({ text });
  } catch (error) {
    console.log("PDF extract (File) error:", error);
    return Response.json({ text: "" }, { status: 500 });
  }
}