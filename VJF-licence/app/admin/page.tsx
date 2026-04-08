"use client";
import { useEffect, useState } from "react";

type Row = {
  id: string; date: string; nick: string; email: string; test: string;
  score: number; total: number; passed: boolean;
};
const LABELS: Record<string, string> = { veterinar: "Veterinář", kovar: "Kovář", trener: "Trenér" };

export default function AdminPage() {
  const [pw, setPw] = useState("");
  const [authed, setAuthed] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("vjf_admin") === "1") {
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (authed) void load();
  }, [authed]);

  async function load() {
    const res = await fetch("/api/admin/results", { headers: { "x-admin": "Thunder156" } });
    if (res.ok) setRows(await res.json());
  }

  async function login() {
    if (pw === "Thunder156") {
      sessionStorage.setItem("vjf_admin", "1");
      setAuthed(true);
      setError("");
    } else {
      setError("Špatné heslo.");
    }
  }

  function logout() {
    sessionStorage.removeItem("vjf_admin");
    setAuthed(false);
    setPw("");
  }

  async function del(id: string) {
    if (!confirm("Opravdu smazat výsledek? Toto resetuje i měsíční limit pokusů pro daný test.")) return;
    const res = await fetch("/api/admin/results", {
      method: "DELETE",
      headers: { "content-type": "application/json", "x-admin": "Thunder156" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) void load();
  }

  if (!authed) {
    return (
      <div className="card" style={{ maxWidth: 400 }}>
        <h1>Administrace</h1>
        <label>
          Heslo
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} />
        </label>
        {error && <p style={{ color: "#c62828" }}>{error}</p>}
        <button className="btn" onClick={login}>Přihlásit</button>
      </div>
    );
  }

  const sorted = [...rows].sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Administrace</h1>
        <button className="btn secondary" onClick={logout}>Odhlásit</button>
      </div>
      {sorted.length === 0 ? (
        <p>Žádné výsledky.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Datum</th><th>Přezdívka</th><th>Email</th><th>Test</th><th>Body</th><th>Výsledek</th><th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.id}>
                <td>{new Date(r.date).toLocaleString("cs-CZ")}</td>
                <td>{r.nick}</td>
                <td>{r.email}</td>
                <td>{LABELS[r.test] || r.test}</td>
                <td>{r.score}/{r.total}</td>
                <td className={r.passed ? "pass" : "fail"}>{r.passed ? "Splněno" : "Nesplněno"}</td>
                <td><button className="btn danger" onClick={() => del(r.id)}>Smazat</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
