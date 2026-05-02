
"use client";

import { UploadCloud, FileText } from "lucide-react";
import uploadFileToBucket from "@/utils/upload";
import { useEffect, useState } from "react";
import { getUser } from "@/utils/auth";
import { saveGuestPdf, getAllGuestPdfs } from "@/utils/db";

interface UploadSectionProps {
  onUploadSuccess?: (newFile: any) => void;
}

export default function UploadSection({ onUploadSuccess }: UploadSectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [activeUser, setActiveUser] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);

  const handleFile = (f: File | undefined) => {
    if (!f) return;
    setFile(f);
    setUploadDone(false);
  };

  useEffect(() => {
    const init = async () => {
      const us = await getUser();
      setActiveUser(us?.email ?? "");
    };
    init();
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      if (activeUser) {
        const newFile = await uploadFileToBucket(file);
        if (newFile && onUploadSuccess) {
          onUploadSuccess(newFile);
        }
      } else {
        await saveGuestPdf(file);
        const allGuest = await getAllGuestPdfs();
        const newest = allGuest[allGuest.length - 1];
        if (newest && onUploadSuccess) {
          onUploadSuccess(newest);
        }
      }
      setFile(null);
      setUploadDone(true);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className={`bg-[#0a0a0a] rounded-2xl p-8 h-full flex flex-col justify-center transition-all cursor-pointer
  border border-dashed
  ${dragActive ? "border-white/40 bg-white/5" : "border-white/10 hover:border-white/20"}
`}
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        handleFile(e.dataTransfer.files?.[0]);
      }}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-4 bg-white/5 rounded-full">
          <UploadCloud size={32} className="text-neutral-300" />
        </div>

        <input
          type="file"
          id="fileUpload"
          className="hidden"
          accept="application/pdf"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        <label
          htmlFor="fileUpload"
          className="text-sm text-neutral-400 cursor-pointer hover:text-white transition"
        >
          Drag & drop your PDF here or <span className="underline">browse</span>
        </label>

        {file && (
          <div className="flex items-center gap-2 mt-2 text-sm text-neutral-300 bg-white/5 px-3 py-2 rounded-lg">
            <FileText size={16} />
            {file.name}
          </div>
        )}

        {uploadDone && !file && (
          <p className="text-xs text-emerald-400">✓ File uploaded successfully!</p>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="px-6 py-2 bg-white text-black   shadow-[0_0_40px_rgba(255,255,255,0.15)] font-semibold rounded-full text-sm mt-4 active:scale-95 transition-transform hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {uploading ? (
            <>
              <span className="w-3 h-3 rounded-full border bg-white text-black flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.15)] animate-spin" />
              Uploading...
            </>
          ) : (
            "Upload"
          )}
        </button>
      </div>
    </div>
  );
}