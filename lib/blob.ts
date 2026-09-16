import { list, put } from "@vercel/blob";

export function blobEnabled(): boolean {
  const token = process.env.BLOB_READ_WRITE_TOKEN ?? "";
  if (token.startsWith("vercel_blob_")) return true;
  // OIDC + store id works on Vercel production/preview, not `next dev`
  return Boolean(process.env.BLOB_STORE_ID && process.env.VERCEL);
}

export async function readJsonBlob<T>(
  pathname: string,
): Promise<T | undefined> {
  const { blobs } = await list({ prefix: pathname });
  const match = blobs.find((blob) => blob.pathname === pathname);
  if (!match) return undefined;
  const cacheBust = match.uploadedAt
    ? `?v=${encodeURIComponent(new Date(match.uploadedAt).toISOString())}`
    : `?t=${Date.now()}`;
  const response = await fetch(`${match.url}${cacheBust}`, { cache: "no-store" });
  if (!response.ok) return undefined;
  return (await response.json()) as T;
}

export async function writeJsonBlob(
  pathname: string,
  data: unknown,
): Promise<void> {
  await put(pathname, `${JSON.stringify(data, null, 2)}\n`, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}
