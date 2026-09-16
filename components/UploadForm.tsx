"use client";

import {
  MONTHS,
  currentMonthYear,
  titleCaseMonth,
  toSlug,
  type MonthName,
} from "@/lib/format";
import { uploadPdfPages } from "@/lib/issue-upload";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UploadForm() {
  const now = currentMonthYear();
  const router = useRouter();
  const [month, setMonth] = useState(now.month);
  const [year, setYear] = useState(String(now.year));
  const [blurb, setBlurb] = useState("");
  const [question, setQuestion] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!file) {
      setMessage("please attach a pdf");
      return;
    }
    setPending(true);
    setMessage("");
    try {
      const storage = (await fetch("/api/storage").then((response) =>
        response.json(),
      )) as { blob?: boolean };

      if (storage.blob) {
        const slug = toSlug(month, Number(year));
        const uploaded = await uploadPdfPages(file, slug, setMessage);
        const response = await fetch("/api/magazines", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            month,
            year: Number(year),
            blurb,
            question,
            cover: uploaded.cover,
            pages: uploaded.pages,
          }),
        });
        const payload = (await response.json()) as {
          error?: string;
          slug?: string;
        };
        if (!response.ok || !payload.slug) {
          setMessage(payload.error ?? "upload failed");
          return;
        }
        router.push(`/catalogs/${payload.slug}`);
        router.refresh();
        return;
      }

      const data = new FormData();
      data.append("month", month);
      data.append("year", year);
      data.append("blurb", blurb);
      data.append("question", question);
      data.append("pdf", file);
      const response = await fetch("/api/magazines", {
        method: "POST",
        body: data,
      });
      const payload = (await response.json()) as {
        error?: string;
        slug?: string;
      };
      if (!response.ok || !payload.slug) {
        setMessage(payload.error ?? "upload failed");
        return;
      }
      router.push(`/catalogs/${payload.slug}`);
      router.refresh();
    } catch {
      setMessage("upload failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="font-hand">month</span>
          <select
            value={month}
            onChange={(event) => setMonth(event.target.value as MonthName)}
            className="mt-1 w-full border-b border-ink bg-transparent py-1 outline-none"
            required
          >
            {MONTHS.map((item) => (
              <option key={item} value={item}>
                {titleCaseMonth(item)}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="font-hand">year</span>
          <input
            type="number"
            min={2020}
            max={2100}
            value={year}
            onChange={(event) => setYear(event.target.value)}
            className="mt-1 w-full border-b border-ink bg-transparent py-1 outline-none"
            required
          />
        </label>
      </div>
      <label className="block">
        <span className="font-hand">a little note (optional)</span>
        <textarea
          value={blurb}
          onChange={(event) => setBlurb(event.target.value)}
          rows={3}
          className="mt-1 w-full border border-ink/20 p-2 outline-none"
        />
      </label>
      <label className="block">
        <span className="font-hand">question of the month (optional)</span>
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          className="mt-1 w-full border-b border-ink bg-transparent py-1 outline-none"
        />
      </label>
      <label className="block">
        <span className="font-hand">pdf</span>
        <input
          type="file"
          accept="application/pdf,.pdf"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="mt-2 block w-full text-sm"
          required
        />
        {file ? (
          <p className="mt-2 text-sm text-quiet">{file.name}</p>
        ) : null}
      </label>
      <button
        type="submit"
        disabled={pending}
        className="font-hand underline underline-offset-4 disabled:opacity-40"
      >
        {pending ? "pasting it in…" : "add to the catalogs"}
      </button>
      {message ? <p className="text-[16px]">{message}</p> : null}
    </form>
  );
}
