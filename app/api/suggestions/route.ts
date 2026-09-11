import { promises as fs } from "node:fs";
import { suggestionsFile } from "@/lib/paths";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as { name?: string; note?: string };
  if (!body.name?.trim() || !body.note?.trim()) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  const raw = await fs.readFile(suggestionsFile, "utf8");
  const list = JSON.parse(raw) as Array<{
    name: string;
    note: string;
    createdAt: string;
  }>;
  list.push({
    name: body.name.trim(),
    note: body.note.trim(),
    createdAt: new Date().toISOString(),
  });
  await fs.writeFile(suggestionsFile, `${JSON.stringify(list, null, 2)}\n`);
  return NextResponse.json({ ok: true });
}
