"use client";

import { UploadCloud, FileText } from "lucide-react";
import uplaodFileToBucket from "@/utils/upload";
import { useState } from "react";

export default function UploadSection(
) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setFile(file);
  };

  return (
    <div
      className={` border rounded-2xl p-8 h-full flex flex-col justify-center transition-all cursor-pointer
      ${dragActive ? "border-white/40 bg-white/5" : "border-white/10 hover:border-white/20"}
      border-dashed`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        handleFile(e.dataTransfer.files?.[0]);
      }}
      
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-4 bg-white/5 rounded-full group-hover:scale-110 transition-transform">
          <UploadCloud size={32} className="text-neutral-300" />
        </div>

        {/* Hidden input */}
        <input
          type="file"
          id="fileUpload"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {/* Click area */}
        <label
          htmlFor="fileUpload"
          className="text-sm text-neutral-400 cursor-pointer hover:text-white transition"
        >
          Drag & drop your PDF here or <span className="underline">browse</span>
        </label>

        {/* File preview */}
        {file && (
          <div className="flex items-center gap-2 mt-2 text-sm text-neutral-300 bg-white/5 px-3 py-2 rounded-lg">
            <FileText size={16} />
            {file.name}
          </div>
        )}

        {/* Button */}
        <button
          onClick={ ()=>  uplaodFileToBucket(file)}
          className="px-6 py-2 bg-white text-black font-semibold rounded-full text-sm mt-4 active:scale-95 transition-transform hover:bg-gray-200"
        >
          Upload
        </button>
      </div>
    </div>
  );
}