"use client";

import { renderPdfPages } from "@/lib/pdf";
import { useEffect, useState } from "react";

export function PdfThumb({
  src,
  className,
  alt = "magazine cover",
}: {
  src: string;
  className?: string;
  alt?: string;
}) {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    renderPdfPages(src, { scale: 0.9, maxPages: 1 })
      .then((pages) => {
        if (!cancelled && pages[0]) setImage(pages[0]);
      })
      .catch(() => {
        if (!cancelled) setImage(null);
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!image) {
    return <div className={`bg-fill ${className ?? ""}`} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={image} alt={alt} className={`object-cover ${className ?? ""}`} />
  );
}
