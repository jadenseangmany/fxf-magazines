"use client";

export async function renderPdfPages(
  url: string,
  options?: { scale?: number; maxPages?: number },
): Promise<string[]> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const pdf = await pdfjs.getDocument({ url }).promise;
  const images: string[] = [];
  const last = Math.min(pdf.numPages, options?.maxPages ?? pdf.numPages);
  const scale = options?.scale ?? 1.45;

  for (let pageNumber = 1; pageNumber <= last; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) continue;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({
      canvasContext: context,
      viewport,
      canvas,
    }).promise;
    images.push(canvas.toDataURL("image/jpeg", 0.84));
  }

  return images;
}

export async function renderPdfFile(
  file: File,
  options?: { scale?: number; maxPages?: number },
): Promise<string[]> {
  const url = URL.createObjectURL(file);
  try {
    return await renderPdfPages(url, options);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function dataUrlToFile(
  dataUrl: string,
  filename: string,
): Promise<File> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], filename, { type: "image/jpeg" });
}
