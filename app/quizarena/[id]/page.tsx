"use client"
import QuizArena from "@/components/arena/arena";
import { use } from "react";

export default function QuizArenaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <QuizArena fileId={id} />;
}