"use client"
import { usePathname } from "next/navigation";
import QuizArena from "@/components/arena/arena";

export default async function QuizArenaPage() {
  const route  = usePathname();
  const fileId = Number(route.split('/').pop());

  // console.log("filed id  ", fileId);
  

  return <QuizArena fileId ={fileId} />;
}