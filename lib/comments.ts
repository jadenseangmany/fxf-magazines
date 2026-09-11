import { promises as fs } from "node:fs";
import { commentsFile } from "@/lib/paths";
import type { Comment } from "@/lib/types";

type CommentStore = Record<string, Comment[]>;

async function readStore(): Promise<CommentStore> {
  const raw = await fs.readFile(commentsFile, "utf8");
  return JSON.parse(raw) as CommentStore;
}

async function writeStore(store: CommentStore): Promise<void> {
  await fs.writeFile(commentsFile, `${JSON.stringify(store, null, 2)}\n`);
}

export async function getComments(slug: string): Promise<Comment[]> {
  const store = await readStore();
  return store[slug] ?? [];
}

export async function addComment(
  slug: string,
  input: { name: string; message: string; parentId?: string | null },
): Promise<Comment> {
  const store = await readStore();
  const comment: Comment = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    message: input.message.trim(),
    createdAt: new Date().toISOString(),
    parentId: input.parentId ?? null,
  };
  store[slug] = [...(store[slug] ?? []), comment];
  await writeStore(store);
  return comment;
}
