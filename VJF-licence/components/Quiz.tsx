"use client";
import { useEffect, useState } from "react";
import type { Question, TestKey } from "@/lib/questions";

type Props = { test: TestKey; title: string; photo: string; alt: string; questions: Question[] };

export default function Quiz({ test, title, photo, alt, questions }: Props) {
  const [phase, setPhase] = useState<"intro" | "form" | "quiz" | "done">("intro");
  const [nick, setNick] = useState("");
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [startAt, setStartAt] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(3600);
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (phase !== "quiz") return;
    const t = setInterval(() => {
      const left = 3600 - Math.floor((Date.now() - startAt) / 1000);
      setRemaining(left);
      if (left <= 0) {
        clearInterval(t);
        void submitTest();
      }
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, startAt]);

  async function startForm() {
    setError("");
    if (!nick.trim() || !email.trim()) {
      setError("Vyplňte přezdívku i email.");
      return;
    }
    // check eligibility
    const res = await fetch("/api/check", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ nick, email, test }),
    });
    const data = await res.json();
    if (!data.allowed) {
      setError(data.reason || "Test nelze spustit.");
      return;
    }
    setStartAt(Date.now());
    setPhase("quiz");
  }

  async function submitTest() {
    if (submitting) return;
    setSubmitting(true);
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ nick, email, test, answers }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Chyba při odesílání.");
      setSubmitting(false);
      return;
    }
    setResult({ score: data.score, passed: data.passed });
    setPhase("done");
    setSubmitting(false);
  }

  if (phase === "intro") {
    return (
      <div>
        <img src={photo} alt={alt} className="hero-photo" />
        <div className="card">
          <h1>{title}</h1>
          <p>Kliknutím níže spustíte přihlášení k testu. Test trvá 1 hodinu a obsahuje 20 otázek.</p>
          <button className="btn" onClick={() => setPhase("form")}>Začít test</button>
        </div>
      </div>
    );
  }

  if (phase === "form") {
    return (
      <div className="card">
        <h2>Přihlášení k testu — {title}</h2>
        <label>
          Přezdívka
          <input value={nick} onChange={(e) => setNick(e.target.value)} />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        {error && <p style={{ color: "#c62828" }}>{error}</p>}
        <p style={{ fontSize: 14, color: "#7a6247" }}>
          Po spuštění bude z virtuální banky odečteno 15 000 Kk a spustí se časovač 1 hodina.
        </p>
        <button className="btn" onClick={startForm}>Spustit test</button>
      </div>
    );
  }

  if (phase === "quiz") {
    const mm = Math.max(0, Math.floor(remaining / 60));
    const ss = Math.max(0, remaining % 60);
    return (
      <div>
        <div className="timer">⏱ Zbývá: {mm}:{ss.toString().padStart(2, "0")}</div>
        <div className="card">
          <h2>Test — {title}</h2>
          {questions.map((q, i) => (
            <div key={i} className="question">
              <p className="qtitle">{i + 1}. {q.q}</p>
              {q.options.map((opt, oi) => (
                <label key={oi}>
                  <input
                    type="radio"
                    name={`q${i}`}
                    checked={answers[i] === oi}
                    onChange={() => setAnswers({ ...answers, [i]: oi })}
                  />{" "}
                  {opt}
                </label>
              ))}
            </div>
          ))}
          {error && <p style={{ color: "#c62828" }}>{error}</p>}
          <button className="btn" onClick={submitTest} disabled={submitting}>
            {submitting ? "Odesílám…" : "Odeslat test"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Výsledek — {title}</h2>
      <p style={{ fontSize: 18 }}>
        Skóre: <b>{result?.score}/20</b>
      </p>
      <p className={result?.passed ? "pass" : "fail"}>
        {result?.passed ? "✔ Splněno — osvědčení vám bude zasláno." : "✘ Nesplněno (minimum 17/20)."}
      </p>
      <p>Z virtuální banky bylo odečteno 15 000 Kk. Další pokusy v tomto měsíci nejsou možné.</p>
    </div>
  );
}
