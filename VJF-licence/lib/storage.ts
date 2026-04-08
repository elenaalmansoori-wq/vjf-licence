import { list, put } from "@vercel/blob";
import type { TestKey } from "./questions";
import fs from "fs/promises";
import path from "path";

export type Result = {
  id: string;
  date: string; // ISO
  nick: string;
  email: string;
  test: TestKey;
  score: number;
  total: number;
  passed: boolean;
};

const BLOB_KEY = "vjf/results.json";
const LOCAL_FILE = path.join(process.cwd(), ".data", "results.json");
const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

async function readLocal(): Promise<Result[]> {
  try {
    const txt = await fs.readFile(LOCAL_FILE, "utf8");
    return JSON.parse(txt);
  } catch {
    return [];
  }
}
async function writeLocal(data: Result[]): Promise<void> {
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(data, null, 2), "utf8");
}

export async function readResults(): Promise<Result[]> {
  if (!useBlob) return readLocal();
  try {
    const { blobs } = await list({ prefix: BLOB_KEY });
    const match = blobs.find((b) => b.pathname === BLOB_KEY);
    if (!match) return [];
    const res = await fetch(match.url, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as Result[];
  } catch {
    return [];
  }
}

export async function writeResults(data: Result[]): Promise<void> {
  if (!useBlob) return writeLocal(data);
  await put(BLOB_KEY, JSON.stringify(data), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function addResult(r: Result): Promise<void> {
  const all = await readResults();
  all.push(r);
  await writeResults(all);
}

export async function deleteResult(id: string): Promise<void> {
  const all = await readResults();
  await writeResults(all.filter((r) => r.id !== id));
}

export function canAttempt(
  results: Result[],
  nick: string,
  email: string,
  test: TestKey
): { allowed: boolean; reason?: string } {
  const key = (s: string) => s.trim().toLowerCase();
  const now = Date.now();
  const month = 30 * 24 * 60 * 60 * 1000;
  const mine = results.filter(
    (r) => key(r.nick) === key(nick) && key(r.email) === key(email)
  );
  const sameTest = mine.filter((r) => r.test === test);
  for (const r of sameTest) {
    if (now - new Date(r.date).getTime() < month) {
      const daysLeft = Math.ceil((month - (now - new Date(r.date).getTime())) / (24 * 60 * 60 * 1000));
      return { allowed: false, reason: `Tento test jste už dělal(a) — zkuste znovu za ${daysLeft} dní.` };
    }
  }
  return { allowed: true };
}
