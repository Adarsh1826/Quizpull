export default function StatsSection({ isGuest }: { isGuest: boolean }) {
  const stats = [
    { label: "Accuracy", value: "88%", color: "text-white" },
    { label: "Practice Time", value: "12m", color: "text-white" },
    { label: "Total Quizzes", value: "04", color: "text-white" },
  ];

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 h-full space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500">Live Stats</h3>
        {isGuest && (
          <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-full border border-yellow-500/20">
            Session Only
          </span>
        )}
      </div>
      
      <div className="space-y-4">
        {stats.map((s, i) => (
          <div key={i} className="flex justify-between items-end border-b border-white/5 pb-2">
            <span className="text-sm text-neutral-500">{s.label}</span>
            <span className={`text-2xl font-bold font-mono tracking-tighter ${s.color}`}>
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}