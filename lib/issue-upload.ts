"use client";

import { dataUrlToFile, renderPdfFile } from "@/lib/pdf";
import { upload } from "@vercel/blob/client";

function pageName(index: number): string {
  return `page-${String(index + 1).padStart(2, "0")}.jpg`;
}

export async function uploadPdfPages(
  file: File,
  slug: string,
  onProgress: (message: string) => void,
): Promise<{ cover: string; pages: string[] }> {
  onProgress("turning the pdf into pages…");
  const dataUrls = await renderPdfFile(file, { scale: 1.35 });
  if (dataUrls.length === 0) {
    throw new Error("could not read that pdf");
  }

  const pages: string[] = [];
  for (let index = 0; index < dataUrls.length; index += 1) {
    onProgress(`uploading page ${index + 1} / ${dataUrls.length}…`);
    const image = await dataUrlToFile(dataUrls[index], pageName(index));
    const blob = await upload(`magazines/${slug}/${pageName(index)}`, image, {
      access: "public",
      handleUploadUrl: "/api/blob",
      multipart: true,
    });
    pages.push(blob.url);
  }

  onProgress("saving the issue…");
  const coverImage = await dataUrlToFile(dataUrls[0], "cover.jpg");
  const cover = await upload(`magazines/${slug}/cover.jpg`, coverImage, {
    access: "public",
    handleUploadUrl: "/api/blob",
    multipart: true,
  });
  return { cover: cover.url, pages };
}
