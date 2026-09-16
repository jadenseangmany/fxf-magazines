import { blobEnabled } from "@/lib/blob";
import { commentsFile } from "@/lib/paths";
import type { Comment } from "@/lib/types";
import { list, put, del } from "@vercel/blob";
import { promises as fs } from "node:fs";

const COMMENTS_PREFIX = "comments";
const SEEDED_PATH = "comments/_seeded.json";

type CommentStore = Record<string, Comment[]>;

function commentBlobPath(slug: string, id: string): string {
  return `${COMMENTS_PREFIX}/${slug}/${id}.json`;
}

async function readLocal(): Promise<CommentStore> {
  try {
    const raw = await fs.readFile(commentsFile, "utf8");
    return JSON.parse(raw) as CommentStore;
  } catch {
    return {};
  }
}

async function writeLocal(store: CommentStore): Promise<void> {
  try {
    await fs.writeFile(commentsFile, `${JSON.stringify(store, null, 2)}\n`);
  } catch {
    // hosted environments are read-only besides /tmp
  }
}

function isComment(value: unknown): value is Comment {
  if (!value || typeof value !== "object") return false;
  const comment = value as Comment;
  return Boolean(comment.id && comment.name && comment.message && comment.createdAt);
}

async function putComment(slug: string, comment: Comment): Promise<void> {
  await put(commentBlobPath(slug, comment.id), `${JSON.stringify(comment)}\n`, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60 * 60 * 24 * 365,
  });
}

async function listIssueFromBlob(slug: string): Promise<Comment[]> {
  const { blobs } = await list({ prefix: `${COMMENTS_PREFIX}/${slug}/` });
  const comments = (
    await Promise.all(
      blobs.map(async (blob) => {
        const response = await fetch(blob.url, { cache: "no-store" });
        if (!response.ok) return null;
        return response.json();
      }),
    )
  ).filter(isComment);
  return comments.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

async function seedBlobFromLocal(): Promise<void> {
  const { blobs } = await list({ prefix: SEEDED_PATH });
  if (blobs.some((blob) => blob.pathname === SEEDED_PATH)) return;

  const local = await readLocal();
  for (const [slug, comments] of Object.entries(local)) {
    for (const comment of comments) {
      await putComment(slug, comment);
    }
  }

  await put(
    SEEDED_PATH,
    `${JSON.stringify({ seededAt: new Date().toISOString() })}\n`,
    {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    },
  );
}

export async function getComments(slug: string): Promise<Comment[]> {
  if (blobEnabled()) {
    try {
      await seedBlobFromLocal();
      return listIssueFromBlob(slug);
    } catch {
      const store = await readLocal();
      return store[slug] ?? [];
    }
  }
  const store = await readLocal();
  return store[slug] ?? [];
}

export async function ensureIssue(slug: string): Promise<void> {
  if (blobEnabled()) {
    await seedBlobFromLocal();
    return;
  }
  const store = await readLocal();
  if (store[slug]) return;
  store[slug] = [];
  await writeLocal(store);
}

export async function clearIssueComments(slug: string): Promise<void> {
  if (blobEnabled()) {
    const { blobs } = await list({ prefix: `${COMMENTS_PREFIX}/${slug}/` });
    if (blobs.length > 0) {
      await del(blobs.map((blob) => blob.url));
    }
  }
  const store = await readLocal();
  store[slug] = [];
  await writeLocal(store);
}

export async function addComment(
  slug: string,
  input: { name: string; message: string; parentId?: string | null },
): Promise<Comment> {
  const comment: Comment = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    message: input.message.trim(),
    createdAt: new Date().toISOString(),
    parentId: input.parentId ?? null,
  };

  if (blobEnabled()) {
    await seedBlobFromLocal();
    await putComment(slug, comment);
    const store = await readLocal();
    store[slug] = [...(store[slug] ?? []), comment];
    await writeLocal(store);
    return comment;
  }

  if (process.env.VERCEL) {
    throw new Error("blob storage is not configured");
  }

  const store = await readLocal();
  store[slug] = [...(store[slug] ?? []), comment];
  await writeLocal(store);
  return comment;
}
