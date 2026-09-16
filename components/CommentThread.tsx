"use client";

import type { Comment } from "@/lib/types";
import { useMemo, useState } from "react";

function timeAgo(iso: string): string {
  const delta = Date.now() - new Date(iso).getTime();
  const minutes = Math.max(1, Math.round(delta / 60000));
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "1 day ago" : `${days} days ago`;
}

function Avatar({ name }: { name: string }) {
  const letter = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/20 bg-white text-xs">
      {letter}
    </div>
  );
}

function CommentCard({
  comment,
  nested,
  onReply,
}: {
  comment: Comment;
  nested?: boolean;
  onReply: (id: string) => void;
}) {
  return (
    <article className={`flex gap-2 ${nested ? "ml-8" : ""}`}>
      <Avatar name={comment.name} />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-baseline gap-2">
          <p className="text-sm font-medium">{comment.name}</p>
          <p className="text-[12px] text-quiet">{timeAgo(comment.createdAt)}</p>
        </div>
        <div
          className={`rounded-2xl px-3 py-2 text-[15px] leading-snug ${
            nested ? "bg-reply" : "bg-white"
          }`}
        >
          {comment.message}
        </div>
        {!nested ? (
          <button
            type="button"
            onClick={() => onReply(comment.id)}
            className="mt-1 text-[12px] text-quiet hover:text-ink"
          >
            reply
          </button>
        ) : null}
      </div>
    </article>
  );
}

export function CommentThread({
  slug,
  initialComments,
}: {
  slug: string;
  initialComments: Comment[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const threads = useMemo(() => {
    const roots = comments.filter((comment) => !comment.parentId);
    return roots.map((root) => ({
      root,
      replies: comments.filter((comment) => comment.parentId === root.id),
    }));
  }, [comments]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          name,
          message,
          parentId: replyTo,
        }),
      });
      const payload = (await response.json()) as Comment & { error?: string };
      if (!response.ok || !payload.id) {
        setError(payload.error ?? "could not save that note");
        return;
      }
      setComments((current) => [...current, payload]);
      setMessage("");
      setReplyTo(null);
    } catch {
      setError("could not save that note");
    } finally {
      setPending(false);
    }
  }

  const replyName = comments.find((comment) => comment.id === replyTo)?.name;

  return (
    <section className="chat-frame relative flex h-full min-h-[520px] w-full max-w-[420px] flex-col px-4 py-5 sm:px-5">
      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        {threads.length === 0 ? (
          <p className="px-2 text-[15px] text-quiet">
            no notes yet. say hi — this thread is for this issue only.
          </p>
        ) : null}
        {threads.map(({ root, replies }) => (
          <div key={root.id} className="space-y-3">
            <CommentCard comment={root} onReply={setReplyTo} />
            {replies.map((reply) => (
              <CommentCard
                key={reply.id}
                comment={reply}
                nested
                onReply={setReplyTo}
              />
            ))}
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="mt-4 border-t border-ink/10 pt-3">
        {replyTo ? (
          <p className="mb-2 text-[12px] text-quiet">
            replying to {replyName}{" "}
            <button type="button" onClick={() => setReplyTo(null)}>
              · cancel
            </button>
          </p>
        ) : null}
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="your name"
          className="mb-2 w-full rounded-full border border-ink/15 bg-white px-3 py-2 text-sm outline-none"
        />
        <div className="rounded-2xl border border-ink/15 bg-white px-3 py-2">
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Message..."
            rows={2}
            className="w-full resize-none text-sm outline-none"
          />
          <div className="mt-2 flex items-center justify-between">
            <div className="flex gap-2 text-quiet" aria-hidden>
              <span className="rounded border border-ink/15 px-1.5 text-[11px]">B</span>
              <span className="rounded border border-ink/15 px-1.5 text-[11px] italic">
                I
              </span>
              <span className="rounded border border-ink/15 px-1.5 text-[11px]">
                ↗
              </span>
            </div>
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-send px-4 py-1.5 text-sm text-white disabled:opacity-50"
            >
              Send
            </button>
          </div>
          {error ? (
            <p className="mt-2 text-[12px] text-quiet">{error}</p>
          ) : null}
        </div>
      </form>
    </section>
  );
}
