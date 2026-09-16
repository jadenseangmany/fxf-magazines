import { blobEnabled } from "@/lib/blob";
import { ensureIssue } from "@/lib/comments";
import { isMonth, toSlug } from "@/lib/format";
import { getMagazine, getMagazines, latestPublished, saveMagazines } from "@/lib/magazines";
import { magazinesDir } from "@/lib/paths";
import { rasterizePdf } from "@/lib/rasterize";
import type { Magazine } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function GET() {
  const magazines = await getMagazines();
  return NextResponse.json(magazines);
}

function isBlobImageUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return host.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

async function publish(
  next: Magazine,
  options?: { replaceCopy?: boolean },
): Promise<{ slug: string; isLatest: boolean }> {
  const magazines = await getMagazines();
  const existing = magazines.find((magazine) => magazine.slug === next.slug);
  const replaceCopy = options?.replaceCopy ?? false;
  const merged: Magazine = {
    ...existing,
    ...next,
    cover: next.cover ?? existing?.cover,
    pages: next.pages ?? existing?.pages,
    pdf: next.pdf ?? existing?.pdf,
    blurb: replaceCopy ? next.blurb : next.blurb || existing?.blurb,
    question: replaceCopy ? next.question : next.question || existing?.question,
  };
  await saveMagazines([
    merged,
    ...magazines.filter((magazine) => magazine.slug !== next.slug),
  ]);
  await ensureIssue(next.slug);
  revalidatePath("/");
  revalidatePath("/catalogs");
  revalidatePath(`/catalogs/${next.slug}`);
  const updated = await getMagazines();
  return {
    slug: next.slug,
    isLatest: latestPublished(updated)?.slug === next.slug,
  };
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    if (!blobEnabled()) {
      return NextResponse.json(
        { error: "blob storage is not configured" },
        { status: 500 },
      );
    }
    const body = (await request.json()) as {
      month?: string;
      year?: number | string;
      blurb?: string;
      question?: string;
      cover?: string;
      pages?: string[];
    };
    const month = String(body.month ?? "").trim().toLowerCase();
    const year = Number(body.year);
    if (!isMonth(month) || !Number.isInteger(year) || year < 2020 || year > 2100) {
      return NextResponse.json({ error: "pick a real month and year" }, { status: 400 });
    }
    const pages = (body.pages ?? []).filter(isBlobImageUrl);
    const cover = body.cover && isBlobImageUrl(body.cover) ? body.cover : pages[0];
    if (!cover || pages.length === 0) {
      return NextResponse.json({ error: "missing pages" }, { status: 400 });
    }
    const result = await publish({
      slug: toSlug(month, year),
      month,
      year,
      status: "published",
      cover,
      pages,
      blurb: body.blurb?.trim() || undefined,
      question: body.question?.trim() || undefined,
    });
    return NextResponse.json(result);
  }

  const form = await request.formData();
  const month = String(form.get("month") ?? "").trim().toLowerCase();
  const year = Number(form.get("year"));
  const blurb = String(form.get("blurb") ?? "").trim();
  const question = String(form.get("question") ?? "").trim();
  const replaceCopy = String(form.get("replaceCopy")) === "1";
  const pdf = form.get("pdf");

  if (!isMonth(month) || !Number.isInteger(year) || year < 2020 || year > 2100) {
    return NextResponse.json({ error: "pick a real month and year" }, { status: 400 });
  }

  const slug = toSlug(month, year);
  const existing = await getMagazine(slug);

  if (!(pdf instanceof File)) {
    if (!replaceCopy || !existing) {
      return NextResponse.json({ error: "please attach a pdf" }, { status: 400 });
    }
    const result = await publish(
      {
        ...existing,
        blurb: blurb || undefined,
        question: question || undefined,
      },
      { replaceCopy: true },
    );
    return NextResponse.json(result);
  }
  const isPdf =
    pdf.type === "application/pdf" || pdf.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    return NextResponse.json({ error: "file must be a pdf" }, { status: 400 });
  }

  await fs.mkdir(magazinesDir, { recursive: true });

  const tmpPath = path.join(os.tmpdir(), `${slug}-${Date.now()}.pdf`);
  const publicPdfPath = path.join(magazinesDir, `${slug}.pdf`);
  await fs.writeFile(tmpPath, Buffer.from(await pdf.arrayBuffer()));

  let raster: { cover?: string; pages?: string[] } = {};
  try {
    raster = await rasterizePdf(slug, tmpPath);
  } finally {
    await fs.unlink(tmpPath).catch(() => undefined);
    await fs.unlink(publicPdfPath).catch(() => undefined);
  }

  if (!raster.pages?.length) {
    return NextResponse.json(
      { error: "could not turn that pdf into pages" },
      { status: 500 },
    );
  }

  const result = await publish(
    {
      slug,
      month,
      year,
      status: "published",
      cover: raster.cover,
      pages: raster.pages,
      blurb: blurb || undefined,
      question: question || undefined,
    },
    { replaceCopy },
  );
  return NextResponse.json(result);
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as {
    slug?: string;
    blurb?: string;
    question?: string;
    cover?: string;
    pages?: string[];
  };
  const slug = String(body.slug ?? "").trim();
  if (!slug) {
    return NextResponse.json({ error: "missing issue" }, { status: 400 });
  }

  const existing = await getMagazine(slug);
  if (!existing) {
    return NextResponse.json({ error: "missing issue" }, { status: 404 });
  }

  const pages = (body.pages ?? []).filter(isBlobImageUrl);
  const cover = body.cover && isBlobImageUrl(body.cover) ? body.cover : undefined;
  if (body.pages && pages.length === 0) {
    return NextResponse.json({ error: "missing pages" }, { status: 400 });
  }

  const result = await publish(
    {
      ...existing,
      cover: cover ?? existing.cover,
      pages: pages.length > 0 ? pages : existing.pages,
      status:
        pages.length > 0 || existing.pages?.length || existing.cover
          ? "published"
          : existing.status,
      blurb: body.blurb?.trim() || undefined,
      question: body.question?.trim() || undefined,
    },
    { replaceCopy: true },
  );
  return NextResponse.json(result);
}
