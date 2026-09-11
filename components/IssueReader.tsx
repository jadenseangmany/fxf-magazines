"use client";

import { MagazineBook } from "@/components/MagazineBook";
import { titleCaseMonth } from "@/lib/format";
import { renderPdfPages } from "@/lib/pdf";
import type { Magazine } from "@/lib/types";
import { useEffect, useState, type ReactNode } from "react";

function CoverPage({ month, year }: { month: string; year: number }) {
  return (
    <div className="flex h-full flex-col items-center justify-between bg-fill px-6 py-10 text-center">
      <p className="font-hand">friends x friends</p>
      <div>
        <p className="font-display lowercase">{month}</p>
        <p className="mt-2 font-hand">{year}</p>
      </div>
      <p className="text-sm text-quiet">a little magazine</p>
    </div>
  );
}

function TextPage({
  kicker,
  title,
  body,
}: {
  kicker?: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex h-full flex-col bg-[#f7f7f5] px-7 py-8">
      {kicker ? (
        <p className="font-hand text-[18px] text-quiet">{kicker}</p>
      ) : null}
      <h3 className="font-hand mt-2">{title}</h3>
      <p className="mt-4 text-[15px] leading-relaxed text-ink/90">{body}</p>
    </div>
  );
}

function BlankPage() {
  return <div className="h-full w-full bg-fill" />;
}

function samplePages(magazine: Magazine): ReactNode[] {
  const month = magazine.month;
  const year = magazine.year;
  if (magazine.slug === "august-2026") {
    return [
      <CoverPage key="cover" month={month} year={year} />,
      <TextPage
        key="letter"
        kicker="letter"
        title="from us to you"
        body="hello from august. we kept the usual updates and made a little products of the month page. read it slowly, like you would on a couch."
      />,
      <TextPage
        key="products"
        kicker="new"
        title="products of the month"
        body="a matcha whisk we keep meaning to use, a pen that does not skip, and the cheap clips holding this whole scrapbook together. take what you want, leave a note."
      />,
      <TextPage
        key="goals"
        kicker="this month"
        title="goals and updates"
        body="we want to stay close even when the calendar gets loud. send a tiny win. send a messy one. both count."
      />,
      <TextPage
        key="q"
        kicker="question of the month"
        title={magazine.question ?? ""}
        body="drop your answer in the thread. no ranking, no spoilers unless you want to spoil."
      />,
      <CoverPage key="back" month={month} year={year} />,
    ];
  }

  return [
    <CoverPage key="cover" month={month} year={year} />,
    <TextPage
      key="hello"
      title={`hello ${month}`}
      body={magazine.blurb ?? "pages for this issue are still being pasted in."}
    />,
    <BlankPage key="blank-1" />,
    <BlankPage key="blank-2" />,
  ];
}

export function IssueReader({ magazine }: { magazine: Magazine }) {
  const fallback = samplePages(magazine);
  const [pdfPages, setPdfPages] = useState<string[] | null>(
    magazine.pages?.length ? magazine.pages : null,
  );
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    if (magazine.pages?.length || !magazine.pdf) return;
    let cancelled = false;
    renderPdfPages(magazine.pdf)
      .then((images) => {
        if (!cancelled) setPdfPages(images);
      })
      .catch(() => {
        if (!cancelled) setPdfError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [magazine.pages, magazine.pdf]);

  if (magazine.pdf && !magazine.pages?.length && !pdfPages && !pdfError) {
    return (
      <div className="flex h-[414px] w-[320px] flex-col items-center justify-center bg-fill text-sm text-quiet">
        opening the zine…
      </div>
    );
  }

  const pages =
    pdfPages && pdfPages.length > 0
      ? pdfPages.map((src, index) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${magazine.slug}-${index}`}
            src={src}
            alt={`page ${index + 1}`}
            className="h-full w-full object-contain bg-[#f7f7f5] pointer-events-none"
          />
        ))
      : fallback;

  return (
    <MagazineBook
      pages={pages}
      label={`${titleCaseMonth(magazine.month)} ${magazine.year}`}
    />
  );
}
