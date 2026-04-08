import { NextResponse } from "next/server";
import { addResult, canAttempt, readResults, type Result } from "@/lib/storage";
import { QUESTIONS, type TestKey } from "@/lib/questions";

export async function POST(req: Request) {
  const { nick, email, test, answers } = (await req.json()) as {
    nick: string; email: string; test: TestKey; answers: Record<string, number>;
  };
  if (!nick?.trim() || !email?.trim() || !test || !QUESTIONS[test]) {
    return NextResponse.json({ error: "Neplatná data." }, { status: 400 });
  }
  const results = await readResults();
  const elig = canAttempt(results, nick, email, test);
  if (!elig.allowed) return NextResponse.json({ error: elig.reason }, { status: 403 });

  const qs = QUESTIONS[test];
  let score = 0;
  qs.forEach((q, i) => {
    if (Number(answers[i]) === q.correct) score++;
  });
  const passed = score >= 17;
  const r: Result = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    nick: nick.trim(),
    email: email.trim(),
    test,
    score,
    total: qs.length,
    passed,
  };
  await addResult(r);
  return NextResponse.json({ score, passed });
}
