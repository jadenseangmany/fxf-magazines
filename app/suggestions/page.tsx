"use client";

import { SiteShell } from "@/components/SiteShell";
import { useState } from "react";

export default function SuggestionsPage() {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, note }),
      });
      if (!response.ok) throw new Error("failed");
      setDone(true);
      setNote("");
    } finally {
      setPending(false);
    }
  }

  return (
    <SiteShell>
      <main className="mx-auto mt-12 max-w-[340px]">
        <h1 className="font-hand mb-6">got ideas?</h1>
        <p className="mb-8">
          we always want more ideas lol. drop a note for the next issue, a meetup,
          a cafe snack, whatever.
        </p>
        {done ? (
          <p className="font-hand">got it — thank you!</p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="font-hand">name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-1 w-full border-b border-ink bg-transparent py-1 outline-none"
                required
              />
            </label>
            <label className="block">
              <span className="font-hand">note</span>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={5}
                className="mt-1 w-full border border-ink/20 bg-transparent p-2 outline-none"
                required
              />
            </label>
            <button
              type="submit"
              disabled={pending}
              className="font-hand underline underline-offset-4 disabled:opacity-40"
            >
              send
            </button>
          </form>
        )}
      </main>
    </SiteShell>
  );
}
