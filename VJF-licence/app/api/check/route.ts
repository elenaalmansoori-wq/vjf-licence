import { NextResponse } from "next/server";
import { canAttempt, readResults } from "@/lib/storage";
import type { TestKey } from "@/lib/questions";

export async function POST(req: Request) {
  const { nick, email, test } = (await req.json()) as { nick: string; email: string; test: TestKey };
  if (!nick?.trim() || !email?.trim() || !test) {
    return NextResponse.json({ allowed: false, reason: "Chybí údaje." });
  }
  const results = await readResults();
  return NextResponse.json(canAttempt(results, nick, email, test));
}
