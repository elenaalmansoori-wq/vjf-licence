import Quiz from "@/components/Quiz";
import { QUESTIONS, TEST_META } from "@/lib/questions";

export default function Page() {
  const m = TEST_META.veterinar;
  return <Quiz test="veterinar" title={m.title} photo={m.photo} alt={m.alt} photoPosition={m.photoPosition} questions={QUESTIONS.veterinar} />;
}
