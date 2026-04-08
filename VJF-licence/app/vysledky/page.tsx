import { readResults } from "@/lib/storage";

export const dynamic = "force-dynamic";

const LABELS: Record<string, string> = { veterinar: "Veterinář", kovar: "Kovář", trener: "Trenér" };

export default async function Page() {
  const all = await readResults();
  const sorted = [...all].sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <div className="card">
      <h1>Výsledky testů</h1>
      {sorted.length === 0 ? (
        <p>Zatím žádné výsledky.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Přezdívka</th>
              <th>Test</th>
              <th>Body</th>
              <th>Výsledek</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.id}>
                <td>{new Date(r.date).toLocaleString("cs-CZ")}</td>
                <td>{r.nick}</td>
                <td>{LABELS[r.test]}</td>
                <td>{r.score}/{r.total}</td>
                <td className={r.passed ? "pass" : "fail"}>{r.passed ? "Splněno" : "Nesplněno"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
