import QuizArena from "@/components/arena/arena";

export default async function QuizArenaPage({ params }: any) {
  const resolvedParams = await params; 
  const fileId = Number(resolvedParams.id); 

  return <QuizArena  />;
}