"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type MagazineBookProps = {
  pages: ReactNode[];
  label?: string;
};

function usePageSize(expanded: boolean) {
  const [size, setSize] = useState({ pageW: 320, pageH: 414 });

  useEffect(() => {
    function update() {
      if (!expanded) {
        setSize({ pageW: 320, pageH: 414 });
        return;
      }
      const maxW = window.innerWidth * 0.94;
      const maxH = window.innerHeight * 0.74;
      let spreadW = maxW;
      let spreadH = spreadW * (11 / 17);
      if (spreadH > maxH) {
        spreadH = maxH;
        spreadW = spreadH * (17 / 11);
      }
      setSize({ pageW: spreadW / 2, pageH: spreadH });
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [expanded]);

  return size;
}

function CoverPreview({
  page,
  onOpen,
}: {
  page: ReactNode;
  onOpen: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={onOpen}
        className="book-stage group cursor-pointer text-left"
        aria-label="open magazine"
      >
        <div className="book-closed relative h-[414px] w-[320px] bg-[#ececec] shadow-[8px_12px_24px_rgba(17,17,17,0.14)] transition-transform duration-300 group-hover:-translate-y-1 [border-radius:2px_10px_10px_2px]">
          <div className="absolute inset-0 overflow-hidden [border-radius:2px_10px_10px_2px]">
            <div className="absolute inset-y-0 left-0 z-10 w-3 bg-gradient-to-r from-black/12 to-transparent" />
            <div className="h-full w-full">{page}</div>
          </div>
          <div
            aria-hidden
            className="absolute top-1 right-[-11px] bottom-1 w-[11px] rounded-r-[3px]"
            style={{
              background:
                "repeating-linear-gradient(90deg, #cfcfcf 0px, #cfcfcf 1px, #ebebeb 1px, #ebebeb 2px)",
            }}
          />
        </div>
      </button>
      <p className="font-hand text-quiet">click to read</p>
    </div>
  );
}

function Spread({
  pages,
  flipped,
  turning,
  pageW,
  pageH,
  onTurn,
}: {
  pages: ReactNode[];
  flipped: number;
  turning: number | null;
  pageW: number;
  pageH: number;
  onTurn: (direction: "prev" | "next") => void;
}) {
  const leaves = useMemo(() => {
    const pairs: { front: ReactNode; back: ReactNode | null }[] = [];
    for (let i = 0; i < pages.length; i += 2) {
      pairs.push({ front: pages[i], back: pages[i + 1] ?? null });
    }
    return pairs;
  }, [pages]);

  const totalLeaves = leaves.length;

  return (
    <div
      className="book-stage shadow-[0_22px_50px_rgba(17,17,17,0.16)]"
      style={{
        width: pageW * 2,
        height: pageH,
      }}
      onPointerUp={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        onTurn(x < rect.width / 2 ? "prev" : "next");
      }}
    >
      <div
        className="book relative h-full"
        style={{
          width: pageW * 2,
          height: pageH,
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-[#f3efe6] shadow-[inset_-18px_0_24px_rgba(17,17,17,0.06)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[#ececec] shadow-[inset_18px_0_24px_rgba(17,17,17,0.05)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-1/2 z-30 w-px -translate-x-1/2 bg-black/20 shadow-[0_0_18px_rgba(17,17,17,0.18)]"
        />

        {leaves.map((leaf, index) => {
          const isFlipped = index < flipped;
          const z =
            turning === index
              ? 80
              : isFlipped
                ? index + 1
                : totalLeaves - index + 20;
          return (
            <div
              key={index}
              className={`book-leaf absolute top-0 left-1/2 h-full ${
                isFlipped ? "is-flipped" : ""
              }`}
              style={{
                width: pageW,
                zIndex: z,
              }}
            >
              <div className="face face-front absolute inset-0 overflow-hidden bg-[#f7f7f5] shadow-[8px_10px_22px_rgba(17,17,17,0.12)]">
                <div className="absolute inset-y-0 left-0 z-10 w-4 bg-gradient-to-r from-black/10 to-transparent" />
                {leaf.front}
              </div>
              <div className="face face-back absolute inset-0 overflow-hidden bg-[#f3efe6] shadow-[-8px_10px_22px_rgba(17,17,17,0.12)]">
                <div className="absolute inset-y-0 right-0 z-10 w-4 bg-gradient-to-l from-black/10 to-transparent" />
                {leaf.back ?? <div className="h-full w-full bg-[#f3efe6]" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MagazineBook({ pages, label }: MagazineBookProps) {
  const total = pages.length;
  const [expanded, setExpanded] = useState(false);
  const [flipped, setFlipped] = useState(0);
  const [turning, setTurning] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const { pageW, pageH } = usePageSize(expanded);
  const turningTimer = useRef<number>(0);

  const leafCount = Math.ceil(total / 2);
  const maxFlip = Math.max(leafCount - 1, 0);

  const markTurning = useCallback((index: number) => {
    window.clearTimeout(turningTimer.current);
    setTurning(index);
    turningTimer.current = window.setTimeout(() => setTurning(null), 920);
  }, []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!expanded) return;
    setFlipped(0);
    const open = window.setTimeout(() => {
      if (leafCount > 1) {
        markTurning(0);
        setFlipped(1);
      }
    }, 520);
    return () => window.clearTimeout(open);
  }, [expanded, leafCount, markTurning]);

  useEffect(() => {
    if (!expanded) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [expanded]);

  const goNext = useCallback(() => {
    setFlipped((value) => {
      if (value >= maxFlip) return value;
      markTurning(value);
      return value + 1;
    });
  }, [maxFlip, markTurning]);

  const goPrev = useCallback(() => {
    setFlipped((value) => {
      if (value <= 0) return value;
      markTurning(value - 1);
      return value - 1;
    });
  }, [markTurning]);

  const close = useCallback(() => {
    setExpanded(false);
    setFlipped(0);
  }, []);

  useEffect(() => {
    if (!expanded) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded, close, goNext, goPrev]);

  if (total === 0) {
    return (
      <div className="flex h-[414px] w-[320px] items-center justify-center bg-fill text-sm text-quiet">
        no pages yet
      </div>
    );
  }

  const leftNumber = Math.max(flipped * 2, 1);
  const rightNumber = Math.min(flipped * 2 + 1, total);
  const pageLabel =
    flipped === 0
      ? `cover${label ? ` · ${label}` : ""}`
      : `${leftNumber}–${rightNumber} / ${total}${label ? ` · ${label}` : ""}`;

  const reader =
    expanded && mounted
      ? createPortal(
          <div className="fixed inset-0 z-50 flex flex-col bg-paper/96">
            <button
              type="button"
              className="absolute inset-0 cursor-default"
              aria-label="close magazine"
              onClick={close}
            />
            <div className="relative z-10 flex items-center justify-between px-6 pt-5">
              <p className="font-hand">{label ?? "magazine"}</p>
              <button
                type="button"
                onClick={close}
                className="font-hand text-quiet hover:text-ink"
              >
                close
              </button>
            </div>
            <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-6">
              <Spread
                pages={pages}
                flipped={flipped}
                turning={turning}
                pageW={pageW}
                pageH={pageH}
                onTurn={(direction) =>
                  direction === "next" ? goNext() : goPrev()
                }
              />
              <p className="font-hand mt-5 text-quiet">{pageLabel}</p>
              <div className="mt-2 flex gap-8 text-sm text-quiet">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={flipped <= 0}
                  className="disabled:opacity-30"
                >
                  ← prev
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={flipped >= maxFlip}
                  className="disabled:opacity-30"
                >
                  next →
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <CoverPreview page={pages[0]} onOpen={() => setExpanded(true)} />
      {reader}
    </>
  );
}
