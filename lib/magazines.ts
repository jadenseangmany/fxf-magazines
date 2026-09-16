import { blobEnabled, readJsonBlob, writeJsonBlob } from "@/lib/blob";
import { sortMagazines } from "@/lib/format";
import { magazinesFile } from "@/lib/paths";
import type { Magazine } from "@/lib/types";
import { promises as fs } from "node:fs";

const CATALOG_BLOB = "catalog/magazines.json";

async function readLocal(): Promise<Magazine[]> {
  const raw = await fs.readFile(magazinesFile, "utf8");
  return JSON.parse(raw) as Magazine[];
}

async function writeLocal(magazines: Magazine[]): Promise<void> {
  try {
    await fs.writeFile(
      magazinesFile,
      `${JSON.stringify(magazines, null, 2)}\n`,
    );
  } catch {
    // hosted environments are read-only besides /tmp
  }
}

export async function getMagazines(): Promise<Magazine[]> {
  if (blobEnabled()) {
    try {
      const stored = await readJsonBlob<Magazine[]>(CATALOG_BLOB);
      if (stored) return sortMagazines(stored);
      const local = sortMagazines(await readLocal());
      await writeJsonBlob(CATALOG_BLOB, local);
      return local;
    } catch {
      return sortMagazines(await readLocal());
    }
  }
  return sortMagazines(await readLocal());
}

export async function getMagazine(slug: string): Promise<Magazine | undefined> {
  const magazines = await getMagazines();
  return magazines.find((magazine) => magazine.slug === slug);
}

export function latestPublished(magazines: Magazine[]): Magazine | undefined {
  return (
    magazines.find(
      (magazine) =>
        magazine.status === "published" &&
        Boolean(magazine.pdf || magazine.cover || magazine.pages?.length),
    ) ?? magazines.find((magazine) => magazine.status === "published")
  );
}

export async function saveMagazines(magazines: Magazine[]): Promise<void> {
  const sorted = sortMagazines(magazines);
  if (blobEnabled()) {
    await writeJsonBlob(CATALOG_BLOB, sorted);
  }
  await writeLocal(sorted);
}
