// "use client";
// import { useEffect, useState } from "react";
// import { getUser } from "@/utils/auth";
// import { fetchUploadFile } from "@/utils/fetch-uploadedFile";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/utils/client";
// import { getAllGuestPdfs } from "@/utils/db";
// import { clearGuestPdfs } from "@/utils/db";

// export default function AllFilePage() {
//   const router = useRouter();
//   const [files, setFiles] = useState<any[]>([]);
//   const [user, setUser] = useState<string>("");
//   const [isGuest, setIsGuest] = useState(false);
//   const [loadingFileId, setLoadingFileId] = useState<string | null>(null);

//   useEffect(() => {
//     const loadData = async () => {
//       const userData = await getUser();

//       if (userData?.id) {
//         // Logged in 
//         setUser(userData.id);
//         setIsGuest(false);
//         await clearGuestPdfs();
//         const filesData = await fetchUploadFile(userData.id);
//         setFiles(filesData ?? []);
//       } else {
//         // Guest
//         setIsGuest(true);
//         const guestFiles = await getAllGuestPdfs();
//         setFiles(guestFiles ?? []);
//       }
//     };
//     loadData();
//   }, []);

//   const handleStartQuiz = async (file: any) => {
//     try {
//       setLoadingFileId(file.id);
      
//       if (isGuest) {
//         // guest files already have questions saved in IndexedDB
//         // just navigate directly
//         router.push(`/quizarena/guest-${file.id}`);
//         return;
//       }

//       //
//       const res = await fetch("/api/extract-text", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ url: file.file_url }),
//       });
//       const { text } = await res.json();
//       if (!text) throw new Error("No text extracted");

//       const quizRes = await fetch("/api/llm", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text }),
//       });
//       const quizData = await quizRes.json();

//       await supabase
//         .from("pdfs")
//         .update({ questions: quizData })
//         .eq("id",file.id)
      

//       router.push(`/quizarena/${file.id}`);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoadingFileId(null);
//     }
//   };

//   const FileCard = ({ file }: { file: any }) => (
//     <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-all">
//       <div className="flex items-center gap-3 min-w-0">
//         <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
//           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
//             <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//             <polyline points="14 2 14 8 20 8" />
//           </svg>
//         </div>
//         <div className="min-w-0">
//           <p className="text-sm font-medium text-white/90 truncate">
//             {file.file_name ?? file.file_url?.split("/").pop() ?? `Quiz ${file.id}`}
//           </p>
//           <p className="text-xs text-white/30 truncate">
//             {isGuest
//               ? `Saved locally · ${new Date(file.created_at).toLocaleDateString()}`
//               : file.file_url}
//           </p>
//         </div>
//       </div>

//       <button
//         onClick={() => handleStartQuiz(file)}
//         disabled={loadingFileId === file.id}
//         className="ml-4 flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-xs text-violet-400 hover:bg-violet-500/20 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         {loadingFileId === file.id ? (
//           <>
//             <span className="w-3 h-3 rounded-full border border-violet-400 border-t-transparent animate-spin" />
//             Loading...
//           </>
//         ) : (
//           <>⚔️ Start Quiz</>
//         )}
//       </button>
//     </div>
//   );

//   return (
//     <div className="p-6 text-white">
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-xl font-bold">Your Files</h1>
//         {isGuest && (
//           <span className="text-xs text-amber-400/70 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
//             Guest Mode · Files saved locally
//           </span>
//         )}
//       </div>

//       {files.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-16 text-white/30 gap-2">
//           <p className="text-sm">No files uploaded yet</p>
//           <p className="text-xs">Upload a PDF to get started</p>
//         </div>
//       ) : (
//         <div className="flex flex-col gap-2">
//           {files.map((file) => (
//             <FileCard key={file.id} file={file} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


"use client";
import React, { useEffect, useState } from "react";
import { getUser } from "@/utils/auth";
import { fetchUploadFile } from "@/utils/fetch-uploadedFile";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/client";
import { getAllGuestPdfs, clearGuestPdfs, deleteGuestPdf } from "@/utils/db";

interface AllFilePageProps {
  newFile?: any;
}

export const AllFilePage: React.FC<AllFilePageProps> = ({ newFile }) => {
  const router = useRouter();
  const [files, setFiles] = useState<any[]>([]);
  const [user, setUser] = useState<string>("");
  const [isGuest, setIsGuest] = useState(false);
  const [loadingFileId, setLoadingFileId] = useState<string | null>(null);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      const userData = await getUser();

      if (userData?.id) {
        setUser(userData.id);
        setUserId(userData.id);
        setIsGuest(false);
        await clearGuestPdfs();
        const filesData = await fetchUploadFile(userData.id);
        setFiles(filesData ?? []);
      } else {
        setIsGuest(true);
        const guestFiles = await getAllGuestPdfs();
        setFiles(guestFiles ?? []);
      }
    };
    loadData();
  }, []);

  // FEATURE 2: Instantly prepend a newly uploaded file without page reload
  useEffect(() => {
    if (!newFile) return;
    setFiles((prev) => {
      const alreadyExists = prev.some((f) => f.id === newFile.id);
      if (alreadyExists) return prev;
      return [newFile, ...prev];
    });
  }, [newFile]);

  // FEATURE 1: Delete handler
  const handleDelete = async (file: any) => {
    const confirmDelete = window.confirm(
      `Delete "${file.file_name ?? "this file"}"? This cannot be undone.`
    );
    if (!confirmDelete) return;

    setDeletingFileId(file.id);
    try {
      if (isGuest) {
        await deleteGuestPdf(file.id);
        setFiles((prev) => prev.filter((f) => f.id !== file.id));
      } else {
        const res = await fetch("/api/delete-file", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileId: file.id,
            fileUrl: file.file_url,
            userId,
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? "Delete failed");
        }
        setFiles((prev) => prev.filter((f) => f.id !== file.id));
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete file. Please try again.");
    } finally {
      setDeletingFileId(null);
    }
  };

  const handleStartQuiz = async (file: any) => {
    try {
      setLoadingFileId(file.id);

      if (isGuest) {
        router.push(`/quizarena/guest-${file.id}`);
        return;
      }

      const res = await fetch("/api/extract-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: file.file_url }),
      });
      const { text } = await res.json();
      if (!text) throw new Error("No text extracted");

      const quizRes = await fetch("/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const quizData = await quizRes.json();

      await supabase
        .from("pdfs")
        .update({ questions: quizData })
        .eq("id", file.id);

      router.push(`/quizarena/${file.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFileId(null);
    }
  };

  const FileCard = ({ file }: { file: any }) => {
    const isDeleting = deletingFileId === file.id;
    const isLoading = loadingFileId === file.id;

    return (
      <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-all">
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
              {file.file_name ?? file.file_url?.split("/").pop() ?? `Quiz ${file.id}`}
            </p>
            <p className="text-xs text-white/30 truncate">
              {isGuest
                ? `Saved locally · ${new Date(file.created_at).toLocaleDateString()}`
                : file.file_url}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="ml-4 flex-shrink-0 flex items-center gap-2">

          {/* Delete button */}
          <button
            onClick={() => handleDelete(file)}
            disabled={isDeleting || isLoading}
            title="Delete file"
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <span className="w-3 h-3 rounded-full border border-red-400 border-t-transparent animate-spin" />
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            )}
          </button>

          {/* Start quiz button */}
          <button
            onClick={() => handleStartQuiz(file)}
            disabled={isLoading || isDeleting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-xs text-violet-400 hover:bg-violet-500/20 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="w-3 h-3 rounded-full border border-violet-400 border-t-transparent animate-spin" />
                Loading...
              </>
            ) : (
              <>⚔️ Start Quiz</>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Your Files</h1>
        {isGuest && (
          <span className="text-xs text-amber-400/70 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
            Guest Mode · Files saved locally
          </span>
        )}
      </div>

      {files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-white/30 gap-2">
          <p className="text-sm">No files uploaded yet</p>
          <p className="text-xs">Upload a PDF to get started</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {files.map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
      )}
    </div>
  );
}