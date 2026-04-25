"use client";
import { useState, useEffect } from "react";

const DUMMY_QUESTIONS = [
  {
    id: 1,
    question: "Which ancient dragon is known as the Flame Sovereign?",
    options: [
      { key: "a", label: "Ignaroth the Eternal" },
      { key: "b", label: "Zephyrax the Cold" },
      { key: "c", label: "Malachar the Wise" },
      { key: "d", label: "Bruthos the Silent" },
    ],
    answer: "a",
  },
  {
    id: 2,
    question: "What element fuels a dragon's breath in the Realm of Ash?",
    options: [
      { key: "a", label: "Stardust crystals" },
      { key: "b", label: "Obsidian fire cores" },
      { key: "c", label: "Phoenix tears" },
      { key: "d", label: "Volcanic soul energy" },
    ],
    answer: "d",
  },
  {
    id: 3,
    question: "How many scales protect a dragon's heart?",
    options: [
      { key: "a", label: "Seven sacred scales" },
      { key: "b", label: "One unbreakable shield" },
      { key: "c", label: "Thirteen blood scales" },
      { key: "d", label: "None — it is exposed" },
    ],
    answer: "c",
  },
  {
    id: 4,
    question: "Which era saw the last great Dragon War?",
    options: [
      { key: "a", label: "The Age of Iron Skies" },
      { key: "b", label: "The Sundering of Worlds" },
      { key: "c", label: "The Third Ember Age" },
      { key: "d", label: "The Void Collapse" },
    ],
    answer: "b",
  },
  {
    id: 5,
    question: "What is the rarest dragon ability in existence?",
    options: [
      { key: "a", label: "Time reversal breath" },
      { key: "b", label: "Soul absorption" },
      { key: "c", label: "Reality fracturing roar" },
      { key: "d", label: "Elemental mimicry" },
    ],
    answer: "c",
  },
];

type Mode = "timed" | "practice" | null;

interface Props {
  fileId: string;
}

export default function QuizArena({ fileId }: Props) {
  const [mode, setMode] = useState<Mode>(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timer, setTimer] = useState(20);
  const [shake, setShake] = useState(false);
  const [entered, setEntered] = useState(false);

  const q = DUMMY_QUESTIONS[current];
  const total = DUMMY_QUESTIONS.length;
  const timerPct = (timer / 20) * 100;
  const timerCritical = timer <= 5;
  const timerWarn = timer <= 10;

  useEffect(() => {
    if (mode) setTimeout(() => setEntered(true), 100);
  }, [mode]);

  useEffect(() => {
    if (mode !== "timed" || confirmed || finished) return;
    if (timer === 0) { handleConfirm(true); return; }
    const t = setTimeout(() => setTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, confirmed, finished, mode]);

  const handleSelect = (key: string) => {
    if (confirmed) return;
    setSelected(key);
  };

  const handleConfirm = (auto = false) => {
    if (confirmed) return;
    setConfirmed(true);
    const isCorrect = (auto ? null : selected) === q.answer;
    if (isCorrect) setScore((s) => s + 1);
    else { setShake(true); setTimeout(() => setShake(false), 500); }
  };

  const handleNext = () => {
    if (current + 1 >= total) { setFinished(true); return; }
    setEntered(false);
    setTimeout(() => {
      setCurrent((c) => c + 1);
      setSelected(null);
      setConfirmed(false);
      setTimer(20);
      setTimeout(() => setEntered(true), 50);
    }, 200);
  };

  const handleRestart = () => {
    setMode(null);
    setEntered(false);
    setTimeout(() => {
      setCurrent(0); setSelected(null); setConfirmed(false);
      setScore(0); setFinished(false); setTimer(20);
    }, 200);
  };

  const optStyle = (key: string): React.CSSProperties => {
    if (!confirmed) {
      if (selected === key) return { border: "1.5px solid rgba(99,102,241,0.7)", background: "rgba(99,102,241,0.07)", color: "#a5b4fc" };
      return { border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.55)" };
    }
    if (key === q.answer) return { border: "1.5px solid rgba(52,211,153,0.6)", background: "rgba(52,211,153,0.06)", color: "#6ee7b7" };
    if (key === selected) return { border: "1.5px solid rgba(239,68,68,0.5)", background: "rgba(239,68,68,0.05)", color: "#fca5a5" };
    return { border: "1px solid rgba(255,255,255,0.04)", background: "transparent", color: "rgba(255,255,255,0.18)" };
  };

  const sharedStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
    @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeSlideIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeSlideOut { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(-8px)} }
    .opt-idle:hover { border-color: rgba(255,255,255,0.14) !important; background: rgba(255,255,255,0.04) !important; color: rgba(255,255,255,0.8) !important; }
  `;

  const bgBase = (
    <>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.07) 0%, transparent 60%)" }} />
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
    </>
  );

  // ── MODE SELECTION SCREEN ──────────────────────────────────────
  if (!mode) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden" style={{ background: "#08090f", fontFamily: "'Sora', sans-serif" }}>
        <style>{sharedStyles}</style>
        {bgBase}
        <div className="w-full max-w-md relative z-10" style={{ animation: "fadeUp 0.4s ease forwards" }}>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400" style={{ boxShadow: "0 0 8px rgba(129,140,248,0.8)" }} />
              <span className="text-xs text-white/30 tracking-widest uppercase">Quiz Arena</span>
            </div>
            <h1 className="text-2xl font-semibold text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
              Choose your mode
            </h1>
            <p className="text-sm text-white/30">How would you like to take this quiz?</p>
          </div>

          {/* Mode cards */}
          <div className="flex flex-col gap-3 mb-8">

            {/* Timed mode */}
            <button onClick={() => setMode("timed")}
              className="group text-left p-5 rounded-2xl transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.border = "1px solid rgba(99,102,241,0.35)";
                (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.05)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
              }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)" }}>
                  ⏱
                </div>
                <span className="text-[10px] font-semibold tracking-widest uppercase px-2 py-1 rounded-full"
                  style={{ background: "rgba(99,102,241,0.1)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }}>
                  Competitive
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">Timed Mode</h3>
              <p className="text-sm text-white/35 leading-relaxed">
                20 seconds per question. Auto-submits when time runs out. Tests how fast you think.
              </p>
              <div className="flex items-center gap-4 mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                {[["20s", "Per question"], ["Auto", "Submit"], ["Fast", "Paced"]].map(([val, lbl]) => (
                  <div key={lbl}>
                    <div className="text-xs font-semibold text-white/60">{val}</div>
                    <div className="text-[10px] text-white/20">{lbl}</div>
                  </div>
                ))}
              </div>
            </button>

            {/* Practice mode */}
            <button onClick={() => setMode("practice")}
              className="group text-left p-5 rounded-2xl transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.border = "1px solid rgba(52,211,153,0.35)";
                (e.currentTarget as HTMLElement).style.background = "rgba(52,211,153,0.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
              }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}>
                  🧘
                </div>
                <span className="text-[10px] font-semibold tracking-widest uppercase px-2 py-1 rounded-full"
                  style={{ background: "rgba(52,211,153,0.08)", color: "#6ee7b7", border: "1px solid rgba(52,211,153,0.2)" }}>
                  Relaxed
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">Practice Mode</h3>
              <p className="text-sm text-white/35 leading-relaxed">
                No time limit. Take as long as you need. Focus on learning, not speed.
              </p>
              <div className="flex items-center gap-4 mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                {[["∞", "No limit"], ["Calm", "Pacing"], ["Learn", "Focused"]].map(([val, lbl]) => (
                  <div key={lbl}>
                    <div className="text-xs font-semibold text-white/60">{val}</div>
                    <div className="text-[10px] text-white/20">{lbl}</div>
                  </div>
                ))}
              </div>
            </button>
          </div>

          <p className="text-center text-xs text-white/15">{total} questions · File {fileId}</p>
        </div>
      </div>
    );
  }

  // ── RESULTS SCREEN ─────────────────────────────────────────────
  if (finished) {
    const pct = Math.round((score / total) * 100);
    const ranks = [
      { min: 80, label: "Exceptional", sub: "Top percentile performance", color: "#f59e0b" },
      { min: 60, label: "Proficient", sub: "Above average result", color: "#6ee7b7" },
      { min: 40, label: "Developing", sub: "Keep practising", color: "#a5b4fc" },
      { min: 0,  label: "Try Again",  sub: "You'll do better next time", color: "#f87171" },
    ];
    const rank = ranks.find((r) => pct >= r.min)!;
    return (
      <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden" style={{ background: "#08090f", fontFamily: "'Sora', sans-serif" }}>
        <style>{sharedStyles}</style>
        {bgBase}
        <div className="w-full max-w-md text-center relative z-10" style={{ animation: "fadeUp 0.4s ease forwards" }}>
          <div className="relative w-40 h-40 mx-auto mb-10">
            <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
              <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
              <circle cx="80" cy="80" r="68" fill="none" strokeWidth="6" strokeLinecap="round"
                stroke={rank.color} strokeDasharray={`${pct * 4.27} 427`}
                style={{ filter: `drop-shadow(0 0 8px ${rank.color}66)` }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-white">{score}</span>
              <span className="text-xs text-white/30 mt-0.5">of {total}</span>
            </div>
          </div>
          <div className="text-xs tracking-[0.25em] uppercase mb-2 font-medium" style={{ color: rank.color }}>{rank.label}</div>
          <h2 className="text-2xl font-semibold text-white mb-1">{pct}% Score</h2>
          <p className="text-sm text-white/30 mb-3">{rank.sub}</p>
          <p className="text-xs text-white/15 mb-8">{mode === "timed" ? "⏱ Timed Mode" : "🧘 Practice Mode"}</p>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[["Correct", score], ["Wrong", total - score], ["Accuracy", `${pct}%`]].map(([lbl, val]) => (
              <div key={lbl as string} className="rounded-xl py-4 px-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="text-xl font-semibold text-white mb-1">{val}</div>
                <div className="text-xs text-white/25">{lbl}</div>
              </div>
            ))}
          </div>
          <button onClick={handleRestart} className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc" }}>
            Choose Mode & Retry
          </button>
        </div>
      </div>
    );
  }

  // ── QUIZ SCREEN ────────────────────────────────────────────────
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#08090f", fontFamily: "'Sora', sans-serif" }}>
      <style>{sharedStyles}</style>
      {bgBase}

      {/* Header */}
      <div className="px-6 pt-6 flex items-center justify-between max-w-2xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full" style={{
            background: mode === "timed" ? "#818cf8" : "#34d399",
            boxShadow: mode === "timed" ? "0 0 8px rgba(129,140,248,0.8)" : "0 0 8px rgba(52,211,153,0.8)"
          }} />
          <span className="text-xs text-white/30">{mode === "timed" ? "Timed Mode" : "Practice Mode"}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/20">{current + 1} / {total}</span>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <span className="text-xs text-white/30">Score</span>
            <span className="text-xs font-semibold text-white">{score}</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-8 pb-10 relative z-10"
        style={{ animation: shake ? "shake 0.5s ease" : entered ? "fadeSlideIn 0.3s ease forwards" : "fadeSlideOut 0.2s ease forwards" }}>

        {/* Timer — only in timed mode */}
        {mode === "timed" && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-xs text-white/20">Time remaining</span>
              <span className="text-xs font-semibold tabular-nums"
                style={{ color: timerCritical ? "#f87171" : timerWarn ? "#fbbf24" : "rgba(255,255,255,0.3)" }}>
                {timer}s
              </span>
            </div>
            <div className="h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="h-full rounded-full transition-all duration-1000" style={{
                width: `${timerPct}%`,
                background: timerCritical ? "linear-gradient(90deg,#ef4444,#f87171)" : timerWarn ? "linear-gradient(90deg,#f59e0b,#fbbf24)" : "linear-gradient(90deg,#6366f1,#818cf8)",
                boxShadow: timerCritical ? "0 0 6px rgba(239,68,68,0.6)" : "0 0 6px rgba(99,102,241,0.4)",
              }} />
            </div>
          </div>
        )}

        {/* Question */}
        <div className="mb-6 rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase px-2 py-0.5 rounded-md"
              style={{ background: "rgba(99,102,241,0.15)", color: "rgba(165,180,252,0.8)", border: "1px solid rgba(99,102,241,0.2)" }}>
              Q{current + 1}
            </span>
            {mode === "practice" && (
              <span className="text-[10px] text-white/20">No time limit</span>
            )}
          </div>
          <p className="text-white text-lg font-medium leading-relaxed" style={{ letterSpacing: "-0.01em" }}>
            {q.question}
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2.5 mb-7">
          {q.options.map((opt) => (
            <button key={opt.key} onClick={() => handleSelect(opt.key)}
              className={`flex items-center gap-4 w-full px-5 py-4 rounded-xl text-left transition-all duration-150 ${!confirmed && selected !== opt.key ? "opt-idle" : ""}`}
              style={optStyle(opt.key)}>
              <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0 uppercase"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "inherit" }}>
                {opt.key}
              </span>
              <span className="text-sm font-medium flex-1">{opt.label}</span>
              {confirmed && opt.key === q.answer && <span className="text-emerald-400 text-xs font-semibold">✓</span>}
              {confirmed && opt.key === selected && opt.key !== q.answer && <span className="text-red-400 text-xs font-semibold">✗</span>}
            </button>
          ))}
        </div>

        {/* CTA */}
        {!confirmed ? (
          <button onClick={() => handleConfirm(false)} disabled={!selected}
            className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: selected ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.03)",
              border: selected ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.06)",
              color: selected ? "#a5b4fc" : "rgba(255,255,255,0.2)",
              boxShadow: selected ? "0 0 20px rgba(99,102,241,0.12)" : "none",
              cursor: selected ? "pointer" : "not-allowed",
            }}>
            Confirm Answer
          </button>
        ) : (
          <button onClick={handleNext}
            className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}>
            {current + 1 >= total ? "See Results →" : "Next Question →"}
          </button>
        )}

        {/* Progress */}
        <div className="flex items-center justify-center gap-1.5 mt-7">
          {DUMMY_QUESTIONS.map((_, i) => (
            <div key={i} className="rounded-full transition-all duration-300" style={{
              width: i === current ? 20 : 6, height: 6,
              background: i < current ? "rgba(99,102,241,0.5)" : i === current ? "#6366f1" : "rgba(255,255,255,0.08)",
              boxShadow: i === current ? "0 0 8px rgba(99,102,241,0.6)" : "none",
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}