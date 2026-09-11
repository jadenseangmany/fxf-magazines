import { toSlug } from "@/lib/format";
import { getMagazines, saveMagazines } from "@/lib/magazines";
import { magazinesDir } from "@/lib/paths";
import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

export async function GET() {
  const magazines = await getMagazines();
  return NextResponse.json(magazines);
}

export async function POST(request: Request) {
  const form = await request.formData();
  const month = String(form.get("month") ?? "").trim().toLowerCase();
  const year = Number(form.get("year"));
  const blurb = String(form.get("blurb") ?? "").trim();
  const question = String(form.get("question") ?? "").trim();
  const pdf = form.get("pdf");

  if (!month || !Number.isFinite(year) || !(pdf instanceof File)) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  if (pdf.type !== "application/pdf") {
    return NextResponse.json({ error: "file must be a pdf" }, { status: 400 });
  }

  const slug = toSlug(month, year);
  await fs.mkdir(magazinesDir, { recursive: true });
  const filename = `${slug}.pdf`;
  const filepath = path.join(magazinesDir, filename);
  const buffer = Buffer.from(await pdf.arrayBuffer());
  await fs.writeFile(filepath, buffer);

  const magazines = await getMagazines();
  const next = magazines.filter((magazine) => magazine.slug !== slug);
  next.unshift({
    slug,
    month,
    year,
    status: "published",
    pdf: `/magazines/${filename}`,
    blurb: blurb || undefined,
    question: question || undefined,
  });
  await saveMagazines(next);

  return NextResponse.json({ slug });
}
