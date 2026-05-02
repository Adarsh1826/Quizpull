"use client";
import { useState, useEffect, useRef } from "react";
import { fetchAllProblemOfSinglePdf } from "@/utils/fetch-problem";
import { useStats } from "@/context/context";
import { getGuestPdfById } from "@/utils/db";
type Mode = "timed" | "practice" | null;

interface Question {
  question: string;
  options: string[];
  correct_answer: string | number;
  explanation?: string;
}

const TIMED_SECONDS = 30;

export default function QuizArena({ fileId }: { fileId: string }) {
  const [mode, setMode] = useState<Mode>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMED_SECONDS);
  const [timerActive, setTimerActive] = useState(false);
  const [results, setResults] = useState<{ correct: boolean }[]>([]);
  const [quizTitle, setQuizTitle] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { updateAfterAnswer, finishQuiz } = useStats();

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    if (!timerActive || mode !== "timed") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setTimerActive(false);
          if (!answered) {
            setAnswered(true);
            setResults((r) => [...r, { correct: false }]);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive, currentIndex]);

  const startQuiz = async (selectedMode: Mode) => {
    setMode(selectedMode);
    setLoading(true);
    try {
      const isGuest = String(fileId).startsWith("guest-");
      const actualId = String(fileId).replace("guest-", "");

      if (isGuest) {

        const file = await getGuestPdfById(Number(actualId));
        //console.log(file);


        const raw = file?.questions;

        setQuizTitle(raw?.quiz_title ?? "Quiz");
        setQuestions(Array.isArray(raw?.questions) ? raw.questions : []);
      }
      else {
        const data = await fetchAllProblemOfSinglePdf(Number(fileId));
        const raw = data?.[0]?.questions;
        setQuizTitle(raw?.quiz_title ?? "Quiz");
        setQuestions(Array.isArray(raw?.questions) ? raw.questions : []);
      }

    } catch {
      setQuestions([]);
    }
    setLoading(false);
    setCurrentIndex(0);
    setScore(0);
    setResults([]);
    setFinished(false);
    setAnswered(false);
    setSelectedOption(null);
    if (selectedMode === "timed") {
      setTimeLeft(TIMED_SECONDS);
      setTimerActive(true);
    }
  };

  const getCorrectIdx = (q: Question) =>
    typeof q.correct_answer === "number"
      ? q.correct_answer
      : q.options.findIndex(
        (o) => o.toLowerCase() === String(q.correct_answer).toLowerCase()
      );

  const handleSelect = (idx: number) => {
    if (answered) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerActive(false);
    setSelectedOption(idx);
    setAnswered(true);
    const isCorrect = idx === getCorrectIdx(questions[currentIndex]);
    updateAfterAnswer(isCorrect);
    if (isCorrect) setScore((s) => s + 1);
    setResults((r) => [...r, { correct: isCorrect }]);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      finishQuiz();
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setAnswered(false);
      if (mode === "timed") {
        setTimeLeft(TIMED_SECONDS);
        setTimerActive(true);
      }
    }
  };

  const reset = () => {
    setMode(null);
    setFinished(false);
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setResults([]);
    setAnswered(false);
    setSelectedOption(null);
  };

  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const timerPct = (timeLeft / TIMED_SECONDS) * 100;
  const q = questions[currentIndex];
  const correctIdx = q && answered ? getCorrectIdx(q) : -1;

  // ── Mode Select ──────────────────────────────────────────────────────────
  if (!mode) {
    return (
      <div className="min-h-screen  flex flex-col items-center justify-center px-6 py-16"
        
      >
        {/* <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        /> */}
        <span className="text-xs font-bold tracking-[0.2em] bg-violet-400/10 border border-violet-400/20 px-4 py-1.5 rounded-full mb-6">
          QUIZ ARENA
        </span>
        <h1 className="font-bold text-center mb-3 text-4xl md:text-5xl bg-gradient-to-br from-white to-violet-400 bg-clip-text text-transparent">
          Test Your Knowledge
        </h1>
        <p className="text-white/40 text-center mb-14 text-base max-w-md">
          Choose your challenge mode and prove your mastery
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl">
          {/* Practice */}
          <button
            onClick={() => startQuiz("practice")}
            className="group relative flex flex-col gap-4 bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-left hover:border-emerald-500/40 hover:bg-white/[0.05] transition-all duration-200 hover:-translate-y-1"
          >
            <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg mb-1">Practice Mode</h2>
              <p className="text-white/40 text-sm leading-relaxed">
                Learn at your own pace. See explanations after each question with no time pressure.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["No Timer", "Explanations", "Relaxed"].map((t) => (
                <span key={t} className="text-xs text-white/40 bg-white/5 border border-white/10 px-3 py-1 rounded-full">{t}</span>
              ))}
            </div>
            <span className="text-emerald-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              Start Practice <span>→</span>
            </span>
          </button>

          {/* Timed */}
          <button
            onClick={() => startQuiz("timed")}
            className="group relative flex flex-col gap-4 bg-white/[0.03] border border-violet-500/30 rounded-2xl p-8 text-left hover:border-violet-500/60 hover:bg-violet-500/5 transition-all duration-200 hover:-translate-y-1"
          >
            <span className="absolute top-4 right-4 text-[10px] font-bold tracking-widest text-violet-400 bg-violet-400/10 border border-violet-400/20 px-2.5 py-1 rounded-full">
              POPULAR
            </span>
            <div className="w-14 h-14 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="13" r="9" />
                <path d="M12 2v2M10 2h4" strokeLinecap="round" />
                <path d="M12 8v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg mb-1">Timed Mode</h2>
              <p className="text-white/40 text-sm leading-relaxed">
                Race against the clock. {TIMED_SECONDS} seconds per question. Only the sharpest minds survive.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[`${TIMED_SECONDS}s per Q`, "High Stakes", "Score Track"].map((t) => (
                <span key={t} className="text-xs text-violet-400/80 bg-violet-400/10 border border-violet-400/20 px-3 py-1 rounded-full">{t}</span>
              ))}
            </div>
            <span className="text-violet-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              Start Timed <span>→</span>
            </span>
          </button>
        </div>
      </div>
    );
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#080810] flex flex-col items-center justify-center gap-4 text-white/40">
        <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-violet-500 animate-spin" />
        <p className="text-sm">Loading your questions…</p>
      </div>
    );
  }

  // ── No Questions ─────────────────────────────────────────────────────────
  if (!loading && questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#080810] flex flex-col items-center justify-center gap-4">
        <p className="text-white/40">No questions found.</p>
        <button onClick={reset} className="text-sm text-violet-400 border border-violet-400/20 px-4 py-2 rounded-lg hover:bg-violet-400/10 transition-colors">
          ← Go Back
        </button>
      </div>
    );
  }

  // ── Finished ─────────────────────────────────────────────────────────────
  if (finished) {
    const grade =
      pct >= 90 ? { label: "Outstanding", color: "text-emerald-400" } :
        pct >= 75 ? { label: "Excellent", color: "text-blue-400" } :
          pct >= 60 ? { label: "Good Job", color: "text-amber-400" } :
            { label: "Keep Practicing", color: "text-rose-400" };

    return (
      <div className="min-h-screen bg-[#080810] flex flex-col items-center justify-center px-6 py-16 gap-6 animate-[fadeIn_0.4s_ease]">
        <div className="w-36 h-36 rounded-full border-4 border-white/5 flex items-center justify-center bg-white/[0.03]">
          <div className="text-center">
            <p className={`text-4xl font-bold ${grade.color}`}>{pct}%</p>
            <p className="text-white/30 text-xs mt-1">Score</p>
          </div>
        </div>
        <div className="text-center">
          <h2 className={`text-2xl font-bold ${grade.color}`}>{grade.label}</h2>
          <p className="text-white/40 mt-1">{score} of {questions.length} correct</p>
        </div>

        <div className="flex gap-2 flex-wrap justify-center max-w-xs">
          {results.map((r, i) => (
            <div
              key={i}
              title={`Q${i + 1}: ${r.correct ? "Correct" : "Wrong"}`}
              className={`w-5 h-5 rounded-md border ${r.correct ? "bg-emerald-500/20 border-emerald-500/50" : "bg-rose-500/20 border-rose-500/50"}`}
            />
          ))}
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => startQuiz(mode)}
            className="px-6 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold transition-colors"
          >
            Retry
          </button>
          <button
            onClick={reset}
            className="px-6 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/20 text-sm transition-colors"
          >
            Choose Mode
          </button>
        </div>
      </div>
    );
  }

  // ── Question Screen ──────────────────────────────────────────────────────
  const progress = (currentIndex / questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col" >
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <button
          onClick={reset}
          className="text-xs text-white/30 border border-white/10 rounded-lg px-3 py-1.5 hover:text-white hover:border-white/20 transition-colors"
        >
          ← Exit
        </button>
        <span className="text-xs font-semibold tracking-wide text-violet-400 bg-violet-400/10 border border-violet-400/20 px-3 py-1.5 rounded-full">
          {mode === "timed" ? "⏱ Timed" : "✓ Practice"}
        </span>
        <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2">
          <span className="text-white font-bold text-lg">{score}</span>
          <span className="text-white/30 text-xs">pts</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-violet-300 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress label + timer */}
      <div className="flex items-center justify-between px-6 py-2.5 text-xs text-white/20 font-medium">
        <span>{currentIndex + 1} / {questions.length}</span>
        {mode === "timed" && (
          <span className={`font-bold text-sm tabular-nums ${timeLeft <= 10 ? "text-rose-400 animate-pulse" : "text-violet-400"}`}>
            {timeLeft}s
          </span>
        )}
      </div>

      {/* Timer track */}
      {mode === "timed" && (
        <div className="h-1 bg-white/5 mx-6 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${timeLeft <= 10 ? "bg-rose-500" : "bg-violet-500"}`}
            style={{ width: `${timerPct}%` }}
          />
        </div>
      )}

      {/* Question */}
      <div className="px-6 pt-8 pb-6 max-w-2xl w-full mx-auto">
        <p className="text-xs font-bold tracking-[0.15em] text-violet-400 uppercase mb-3">
          Question {currentIndex + 1}
        </p>
        <h2 className="text-white text-xl md:text-2xl font-semibold leading-snug">
          {q?.question}
        </h2>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3 px-6 pb-6 max-w-2xl w-full mx-auto">
        {q?.options?.map((opt, idx) => {
          const isCorrect = answered && idx === correctIdx;
          const isWrong = answered && idx === selectedOption && idx !== correctIdx;
          const isDim = answered && idx !== correctIdx && idx !== selectedOption;

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={answered}
              className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl border text-left transition-all duration-150
                ${isCorrect ? "bg-emerald-500/10 border-emerald-500/50 text-white" : ""}
                ${isWrong ? "bg-rose-500/10 border-rose-500/40 text-white/60" : ""}
                ${isDim ? "bg-white/[0.02] border-white/5 text-white/30" : ""}
                ${!answered ? "bg-white/[0.03] border-white/10 text-white/80 hover:bg-white/[0.06] hover:border-white/20 hover:translate-x-1 cursor-pointer" : "cursor-default"}
              `}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors
                ${isCorrect ? "bg-emerald-500/20 text-emerald-400" : ""}
                ${isWrong ? "bg-rose-500/20 text-rose-400" : ""}
                ${!isCorrect && !isWrong ? "bg-white/5 text-white/30" : ""}
              `}>
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1 text-sm md:text-base leading-relaxed">{opt}</span>
              {isCorrect && <span className="text-emerald-400 font-bold text-lg">✓</span>}
              {isWrong && <span className="text-rose-400 font-bold text-lg">✗</span>}
            </button>
          );
        })}
      </div>

      {/* Explanation (practice) */}
      {mode === "practice" && answered && q?.explanation && (
        <div className="mx-6 mb-6 max-w-2xl w-full mx-auto bg-blue-500/5 border border-blue-500/20 rounded-xl px-5 py-4">
          <span className="text-xs font-bold tracking-widest text-blue-400 uppercase block mb-2">Explanation</span>
          <p className="text-white/50 text-sm leading-relaxed">{q.explanation}</p>
        </div>
      )}

      {/* Next */}
      {answered && (
        <div className="flex justify-end px-6 pb-10 max-w-2xl w-full mx-auto">
          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-xl bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            {currentIndex + 1 >= questions.length ? "See Results" : "Next Question"} →
          </button>
        </div>
      )}
    </div>
  );
}

