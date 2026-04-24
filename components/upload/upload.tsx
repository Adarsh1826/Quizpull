import { UploadCloud } from "lucide-react";

export default function UploadSection({ onGenerate }: { onGenerate: () => void }) {
  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 h-full flex flex-col justify-center border-dashed hover:border-white/20 transition-colors group cursor-pointer">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-4 bg-white/5 rounded-full group-hover:scale-110 transition-transform">
          <UploadCloud size={32} className="text-neutral-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Upload PDF</h3>
          <p className="text-neutral-500 text-sm">Drag and drop or click to browse</p>
        </div>
        <button 
          onClick={onGenerate}
          className="px-6 py-2 bg-white text-black font-bold rounded-full text-sm mt-4 active:scale-95 transition-transform"
        >
          Generate Quiz
        </button>
      </div>
    </div>
  );
}