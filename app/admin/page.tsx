"use client";

import { SiteShell } from "@/components/SiteShell";
import { useState } from "react";

export default function AdminPage() {
  const [month, setMonth] = useState("october");
  const [year, setYear] = useState("2026");
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
      const payload = (await response.json()) as { error?: string; slug?: string };
      if (!response.ok) {
        setMessage(payload.error ?? "upload failed");
        return;
      }
      setMessage(`saved ${payload.slug}`);
    } finally {
      setPending(false);
    }
  }

  return (
    <SiteShell>
      <main className="mx-auto mt-12 max-w-[420px]">
        <h1 className="font-hand mb-3">upload a monthly pdf</h1>
        <p className="mb-8 text-[16px] text-quiet">
          editors only. the issue appears at the top of catalogs, newest first,
          and opens with a book-flip reader.
        </p>
        <form onSubmit={submit} className="space-y-5">
          <label className="block">
            <span className="font-hand">month</span>
            <input
              value={month}
              onChange={(event) => setMonth(event.target.value)}
              className="mt-1 w-full border-b border-ink bg-transparent py-1 outline-none"
              required
            />
          </label>
          <label className="block">
            <span className="font-hand">year</span>
            <input
              value={year}
              onChange={(event) => setYear(event.target.value)}
              className="mt-1 w-full border-b border-ink bg-transparent py-1 outline-none"
              required
            />
          </label>
          <label className="block">
            <span className="font-hand">blurb</span>
            <textarea
              value={blurb}
              onChange={(event) => setBlurb(event.target.value)}
              rows={3}
              className="mt-1 w-full border border-ink/20 p-2 outline-none"
            />
          </label>
          <label className="block">
            <span className="font-hand">question of the month</span>
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
              accept="application/pdf"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="mt-2 block w-full text-sm"
              required
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="font-hand underline underline-offset-4 disabled:opacity-40"
          >
            publish
          </button>
        </form>
        {message ? <p className="mt-6 text-[16px]">{message}</p> : null}
      </main>
    </SiteShell>
  );
}
