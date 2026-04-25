"use client";
import { useEffect, useState } from "react";
import { getUser } from "@/utils/auth";
import { fetchUploadFile } from "@/utils/fetch-uploadedFile";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/client";

export default function AllFilePage() {
  const router = useRouter();
  const [files, setFiles] = useState<any[]>([]);
  const [user, setUser] = useState("");
  const [quizText, setQuizText] = useState<string | null>(null);
  const [loadingFileId, setLoadingFileId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const userData = await getUser();
      if (!userData?.id) return;
      setUser(userData.id);

      const filesData = await fetchUploadFile(userData.id);
      setFiles(filesData ?? []);
    };

    loadData();
  }, []);


  const handleStartQuiz = async (file: any) => {
    try {
      setLoadingFileId(file.id);

      // 1. extract text from PDF
      const res = await fetch("/api/extract-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: file.file_url }),
      });

      const { text } = await res.json();

      if (!text) throw new Error("No text extracted");

      // 2. send to your quiz generator endpoint
      const quizRes = await fetch("/api/llm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const quizData = await quizRes.json();
      await supabase.from("pdfs").update({
        questions: quizData
      }).eq("id", file.id)


      router.push(`/quizarena/${file.id}`)
      // optional: just show raw for now
      setQuizText(JSON.stringify(quizData, null, 2));

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFileId(null);
    }
  };
  
  // File List
  return (
    <div className="p-6 text-white">
      <h1 className="text-xl font-bold mb-4">Your Files</h1>

      {files.length === 0 ? (
        <p className="text-white/40">No files uploaded</p>
      ) : (
        <div className="flex flex-col gap-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-all"
            >
              {/* File info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white/90 truncate">
                    {file.file_name ?? file.file_url.split("/").pop()}
                  </p>
                  <p className="text-xs text-white/30 truncate">{file.file_url}</p>
                </div>
              </div>

              {/* Start Quiz Button */}
              <button
                onClick={() => handleStartQuiz(file)}
                disabled={loadingFileId === file.id}
                className="ml-4 flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-xs text-violet-400 hover:bg-violet-500/20 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingFileId === file.id ? (
                  <>
                    <span className="w-3 h-3 rounded-full border border-violet-400 border-t-transparent animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>⚔️ Start Quiz</>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}