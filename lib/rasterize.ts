import { magazinesDir } from "@/lib/paths";
import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

function pageIndex(name: string): number {
  const match = name.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

export async function rasterizePdf(
  slug: string,
  pdfPath: string,
): Promise<{ cover?: string; pages?: string[] }> {
  const outDir = path.join(magazinesDir, slug);
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });

  const env = {
    ...process.env,
    PATH: `/opt/homebrew/bin:/usr/local/bin:${process.env.PATH ?? ""}`,
  };

  try {
    await execFileAsync(
      "pdftoppm",
      [
        "-jpeg",
        "-r",
        "140",
        "-jpegopt",
        "quality=82",
        pdfPath,
        path.join(outDir, "page"),
      ],
      { env, timeout: 120_000 },
    );
    await execFileAsync(
      "pdftoppm",
      [
        "-jpeg",
        "-f",
        "1",
        "-l",
        "1",
        "-singlefile",
        "-r",
        "90",
        "-jpegopt",
        "quality=80",
        pdfPath,
        path.join(outDir, "cover"),
      ],
      { env, timeout: 60_000 },
    );
  } catch {
    return {};
  }

  const files = await fs.readdir(outDir);
  const pages = files
    .filter((file) => /^page-\d+\.jpg$/.test(file))
    .sort((a, b) => pageIndex(a) - pageIndex(b))
    .map((file) => `/magazines/${slug}/${file}`);
  const cover = files.includes("cover.jpg")
    ? `/magazines/${slug}/cover.jpg`
    : pages[0];

  if (pages.length === 0) return {};
  return { cover, pages };
}
