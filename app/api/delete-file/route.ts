import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function DELETE(req: Request) {
  try {
    const { fileId, fileUrl, userId } = await req.json();

    if (!fileId || !userId) {
      return NextResponse.json(
        { error: "Missing fileId or userId" },
        { status: 400 }
      );
    }

    // Derive the storage path from the public URL
    // Public URL format: .../storage/v1/object/public/content/<userId>/<filename>
    const storagePathMatch = fileUrl?.match(/\/object\/public\/content\/(.+)$/);
    if (storagePathMatch) {
      const storagePath = storagePathMatch[1];
      const { error: storageError } = await supabase.storage
        .from("content")
        .remove([storagePath]);

      if (storageError) {
        console.error("Storage delete error:", storageError.message);
        // Continue anyway — still delete the DB row
      }
    }

    // Delete the row from the pdfs table
    const { error: dbError } = await supabase
      .from("pdfs")
      .delete()
      .eq("id", fileId)
      .eq("user_id", userId); // Safety: only owner can delete

    if (dbError) {
      return NextResponse.json(
        { error: "Failed to delete from database" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete file error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}