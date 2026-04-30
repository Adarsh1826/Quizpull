import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

   
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("USER:", user);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, file_url } = await req.json();

    
    const storagePathMatch = file_url?.match(
      /\/object\/public\/content\/(.+)$/
    );

    if (storagePathMatch) {
      const storagePath = storagePathMatch[1];

      const { error: storageError } = await supabase.storage
        .from("content")
        .remove([storagePath]);

      if (storageError) {
        console.error("Storage delete error:", storageError.message);
      }
    }

    
    const { data, error } = await supabase
      .from("pdfs")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)
      .select();

    console.log("DELETED:", data);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Delete blocked by RLS" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}