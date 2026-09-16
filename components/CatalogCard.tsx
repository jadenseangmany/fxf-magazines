import { Doodle } from "@/components/Doodle";
import { PdfThumb } from "@/components/PdfThumb";
import type { Magazine } from "@/lib/types";
import Link from "next/link";
import type { ReactNode } from "react";

function Cover({ magazine }: { magazine: Magazine }) {
  let inside: ReactNode = <span className="absolute inset-0 bg-fill" />;

  if (magazine.status === "coming-soon") {
    inside = <p className="font-hand">coming soon...</p>;
  } else if (magazine.cover) {
    inside = (
      <span
        className="catalog-cover-art"
        role="img"
        aria-label={`${magazine.month} cover`}
        style={{ backgroundImage: `url("${magazine.cover}")` }}
      />
    );
  } else if (magazine.pdf) {
    inside = <PdfThumb src={magazine.pdf} alt={`${magazine.month} cover`} />;
  }

  return <div className="catalog-cover hand-border">{inside}</div>;
}

export function CatalogCard({ magazine }: { magazine: Magazine }) {
  const comingSoon = magazine.status === "coming-soon";
  const card = (
    <article className="relative w-[250px] shrink-0">
      {magazine.month === "september" ? (
        <Doodle
          src="/doodles/catalog-1/duck.png"
          width={102}
          height={81}
          className="absolute bottom-[calc(100%-8px)] left-2 z-10 w-[70px] sm:left-3 sm:w-[78px]"
        />
      ) : null}
      <Cover magazine={magazine} />
      <p className="font-hand relative mt-3">
        {magazine.month === "august" ? (
          <Doodle
            src="/doodles/sparkle-2.png"
            width={40}
            height={66}
            className="absolute -left-11 top-4 w-10 rotate-[330deg]"
          />
        ) : null}
        {magazine.month}
      </p>
    </article>
  );

  if (comingSoon) return card;

  return (
    <Link href={`/catalogs/${magazine.slug}`} className="group relative block w-[250px] shrink-0">
      {card}
    </Link>
  );
}
