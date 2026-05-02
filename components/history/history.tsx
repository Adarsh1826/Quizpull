"use client";

import { Lock, Clock, ChevronRight, FileText } from "lucide-react";


export default function HistorySection({activeUser}:{activeUser:string}) {

  // Mock data for display
  const historyData = [
    {
      id: 1,
      title: "Machine Learning Ethics.pdf",
      date: "2 hours ago",
      score: "94%",
      questions: 12,
    },
    {
      id: 2,
      title: "Cell Biology - Midterm Review.pdf",
      date: "Yesterday",
      score: "78%",
      questions: 25,
    },
    {
      id: 3,
      title: "Microeconomics 101.pdf",
      date: "Oct 22, 2026",
      score: "100%",
      questions: 10,
    },
  ];

 

  return (
    <div className="relative w-full">
      {/* Header Area */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-white">Quiz History</h2>
          {!activeUser && (
            <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
              Local Only
            </span>
          )}
        </div>
        <button className={`text-xs font-medium text-neutral-500 hover:text-white transition-colors ${!activeUser ? 'invisible' : 'visible'}`}>
          View Full Archive
        </button>
      </div>

      {/* Main List Container */}
      <div className="relative bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
        
        {/* The List of Items */}
        <div className={`divide-y divide-white/5 ${!activeUser ? "blur-[6px] select-none pointer-events-none opacity-50" : ""}`}>
          {historyData.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-neutral-400 group-hover:text-white transition-colors">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white group-hover:text-white transition-colors line-clamp-1">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[11px] text-neutral-500">
                      <Clock size={12} />
                      {item.date}
                    </span>
                    <span className="text-[11px] text-neutral-600">•</span>
                    <span className="text-[11px] text-neutral-500">
                      {item.questions} Questions
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm font-mono font-bold text-white tracking-tighter">
                    {item.score}
                  </p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-medium">Score</p>
                </div>
                <ChevronRight size={16} className="text-neutral-700 group-hover:text-white transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* GUEST OVERLAY - The "Paywall" UI */}
        {/* {!activeUser && ( */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 bg-black/20 backdrop-blur-[2px]">
            <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.15)] mb-6">
              <Lock size={24} />
            </div>
            
            <div className="text-center space-y-2 max-w-xs">
              <h3 className="text-md font-bold text-white tracking-tight">Something is brewing</h3>
              {/* <p className="text-sm text-neutral-400 leading-relaxed">
                As a guest, your progress will be cleared when you close this session. Sign in to save your quizzes forever.
              </p> */}
            </div>

            
          </div>
        {/* )} */}
      </div>

      {/* Footer Info (Visible only to users) */}
      {/* {activeUser&& ( */}
        <div className="mt-4 flex items-center gap-2 text-xs text-neutral-600 px-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
          Cloud sync active. All sessions are saved.
        </div>
      {/* )} */}
    </div>
  );
}