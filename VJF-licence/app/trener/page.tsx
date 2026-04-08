import Quiz from "@/components/Quiz";
import { QUESTIONS, TEST_META } from "@/lib/questions";

export default function Page() {
  const m = TEST_META.trener;
  return <Quiz test="trener" title={m.title} photo={m.photo} alt={m.alt} questions={QUESTIONS.trener} />;
}
