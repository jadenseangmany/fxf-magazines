"use client";

import { uploadPdfPages } from "@/lib/issue-upload";
import type { Magazine } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function IssueEditor({ magazine }: { magazine: Magazine }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [blurb, setBlurb] = useState(magazine.blurb ?? "");
  const [question, setQuestion] = useState(magazine.question ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setBlurb(magazine.blurb ?? "");
    setQuestion(magazine.question ?? "");
  }, [magazine.blurb, magazine.question]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    try {
      const storage = (await fetch("/api/storage").then((response) =>
        response.json(),
      )) as { blob?: boolean };

      if (file && storage.blob) {
        const uploaded = await uploadPdfPages(file, magazine.slug, setMessage);
        const response = await fetch("/api/magazines", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: magazine.slug,
            blurb,
            question,
            cover: uploaded.cover,
            pages: uploaded.pages,
          }),
        });
        const payload = (await response.json()) as { error?: string };
        if (!response.ok) {
          setMessage(payload.error ?? "could not save");
          return;
        }
      } else if (file) {
        const data = new FormData();
        data.append("month", magazine.month);
        data.append("year", String(magazine.year));
        data.append("blurb", blurb);
        data.append("question", question);
        data.append("replaceCopy", "1");
        data.append("pdf", file);
        const response = await fetch("/api/magazines", {
          method: "POST",
          body: data,
        });
        const payload = (await response.json()) as { error?: string };
        if (!response.ok) {
          setMessage(payload.error ?? "could not save");
          return;
        }
      } else {
        const response = await fetch("/api/magazines", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: magazine.slug,
            blurb,
            question,
          }),
        });
        const payload = (await response.json()) as { error?: string };
        if (!response.ok) {
          setMessage(payload.error ?? "could not save");
          return;
        }
      }

      setOpen(false);
      setFile(null);
      router.refresh();
    } catch {
      setMessage("could not save");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-6 w-full max-w-[280px]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="font-hand text-quiet underline decoration-ink/30 underline-offset-4 hover:text-ink"
      >
        {open ? "close" : "edit this issue"}
      </button>
      {open ? (
        <form onSubmit={submit} className="mt-4 space-y-4">
          <label className="block">
            <span className="font-hand">a little note</span>
            <textarea
              value={blurb}
              onChange={(event) => setBlurb(event.target.value)}
              rows={4}
              className="mt-1 w-full border border-ink/20 p-2 text-[16px] outline-none"
            />
          </label>
          <label className="block">
            <span className="font-hand">question of the month</span>
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              className="mt-1 w-full border-b border-ink bg-transparent py-1 text-[16px] outline-none"
            />
          </label>
          <label className="block">
            <span className="font-hand">replace pdf (optional)</span>
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="mt-2 block w-full text-sm"
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
            {pending ? "saving…" : "save"}
          </button>
          {message ? <p className="text-[16px]">{message}</p> : null}
        </form>
      ) : null}
    </div>
  );
}
