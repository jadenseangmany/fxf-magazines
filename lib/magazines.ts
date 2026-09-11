import { promises as fs } from "node:fs";
import { sortMagazines } from "@/lib/format";
import { magazinesFile } from "@/lib/paths";
import type { Magazine } from "@/lib/types";

export async function getMagazines(): Promise<Magazine[]> {
  const raw = await fs.readFile(magazinesFile, "utf8");
  const magazines = JSON.parse(raw) as Magazine[];
  return sortMagazines(magazines);
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
  await fs.writeFile(magazinesFile, `${JSON.stringify(magazines, null, 2)}\n`);
}
