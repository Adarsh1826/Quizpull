// app/quizarena/[id]/page.tsx
import QuizArena from "@/components/arena/arena";// move component to components folder

interface Props {
  params: { id: string };
}

export default function QuizArenaPage({ params }: Props) {
  return <QuizArena fileId={params.id} />;
}