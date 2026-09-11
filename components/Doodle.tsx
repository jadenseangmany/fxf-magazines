import Image from "next/image";

type DoodleProps = {
  src: string;
  alt?: string;
  width: number;
  height: number;
  className?: string;
};

export function Doodle({
  src,
  alt = "",
  width,
  height,
  className,
}: DoodleProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`pointer-events-none select-none ${className ?? ""}`}
    />
  );
}

export function Sparkle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 42 42"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none text-ink ${className ?? ""}`}
    >
      <path
        d="M8 21c4.2-1.1 6.4-3.6 8-8 1.4 4.2 3.7 6.8 8 8-4.4 1.4-6.7 3.8-8 8-1.5-4.3-3.7-6.7-8-8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M27 11c1.8-.4 2.7-1.4 3.4-3.3.6 1.8 1.6 2.8 3.4 3.3-1.9.6-2.8 1.5-3.4 3.4-.6-1.8-1.6-2.8-3.4-3.4Z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

export function Burst({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none text-ink ${className ?? ""}`}
    >
      <path
        d="M24 6v6M24 36v6M6 24h6M36 24h6M11 11l4 4M33 33l4 4M37 11l-4 4M15 33l-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
