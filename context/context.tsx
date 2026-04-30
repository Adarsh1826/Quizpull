"use client";

import { createContext, useContext, useState, useEffect } from "react";

type StatsType = {
  accuracy: number;
  totalQuizzes: number;
  practiceTime: number;
  updateAfterAnswer: (correct: boolean) => void;
  finishQuiz: () => void;
};

const StatsContext = createContext<StatsType | null>(null);

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [quizzes, setQuizzes] = useState(0);
  const [practiceTime, setPracticeTime] = useState(0);

  
  const updateAfterAnswer = (isCorrect: boolean) => {
    setTotal((t) => t + 1);
    if (isCorrect) setCorrect((c) => c + 1);
  };

 
  const finishQuiz = () => {
    setQuizzes((q) => q + 1);
  };

 
  const accuracy = total === 0 ? 0 : Math.round((correct / total) * 100);

 
  useEffect(() => {
    const interval = setInterval(() => {
      setPracticeTime((t) => t + 1);
    }, 60000); // 1 min

    return () => clearInterval(interval);
  }, []);

  return (
    <StatsContext.Provider
      value={{
        accuracy,
        totalQuizzes: quizzes,
        practiceTime,
        updateAfterAnswer,
        finishQuiz,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
}


export const useStats = () => {
  const ctx = useContext(StatsContext);
  if (!ctx) throw new Error("useStats must be used inside StatsProvider");
  return ctx;
};