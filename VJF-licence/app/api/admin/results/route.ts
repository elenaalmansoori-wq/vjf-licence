import { NextResponse } from "next/server";
import { deleteResult, readResults } from "@/lib/storage";

const ADMIN_PW = "Thunder156";

function check(req: Request) {
  return req.headers.get("x-admin") === ADMIN_PW;
}

export async function GET(req: Request) {
  if (!check(req)) return NextResponse.json({ error: "unauth" }, { status: 401 });
  return NextResponse.json(await readResults());
}

export async function DELETE(req: Request) {
  if (!check(req)) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const { id } = (await req.json()) as { id: string };
  await deleteResult(id);
  return NextResponse.json({ ok: true });
}
