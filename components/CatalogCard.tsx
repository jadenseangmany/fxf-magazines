import { Doodle } from "@/components/Doodle";
import { PdfThumb } from "@/components/PdfThumb";
import type { Magazine } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

export function CatalogCard({ magazine }: { magazine: Magazine }) {
  const comingSoon = magazine.status === "coming-soon";
  const card = (
    <article className="relative w-[230px] shrink-0 snap-start sm:w-[250px]">
      {magazine.month === "september" ? (
        <Doodle
          src="/doodles/catalog-1/duck.png"
          width={102}
          height={81}
          className="absolute -top-10 left-1/2 z-10 w-16 -translate-x-1/2 sm:w-[78px]"
        />
      ) : null}
      {comingSoon ? (
        <div className="hand-border flex aspect-[3/4.3] items-center justify-center bg-paper">
          <p className="font-hand">coming soon...</p>
        </div>
      ) : magazine.cover ? (
        <Image
          src={magazine.cover}
          alt={`${magazine.month} cover`}
          width={250}
          height={358}
          className="aspect-[3/4.3] w-full object-cover"
        />
      ) : magazine.pdf ? (
        <PdfThumb
          src={magazine.pdf}
          alt={`${magazine.month} cover`}
          className="aspect-[3/4.3] w-full"
        />
      ) : (
        <div className="flex aspect-[3/4.3] items-center justify-center bg-fill transition-transform duration-300 group-hover:-translate-y-1" />
      )}
      <p className="font-hand mt-3">{magazine.month}</p>
    </article>
  );

  if (comingSoon) return card;

  return (
    <Link href={`/catalogs/${magazine.slug}`} className="group relative shrink-0">
      {card}
    </Link>
  );
}
