import { Doodle } from "@/components/Doodle";
import { CatalogCard } from "@/components/CatalogCard";
import { SiteShell } from "@/components/SiteShell";
import { getMagazines } from "@/lib/magazines";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "catalogs",
};

export default async function CatalogsPage() {
  const magazines = (await getMagazines()).filter(
    (magazine) =>
      magazine.status === "coming-soon" ||
      Boolean(magazine.cover || magazine.pdf || magazine.pages?.length),
  );

  return (
    <SiteShell>
      <main className="relative mt-10">
        <Doodle
          src="/doodles/catalog-1/matcha.png"
          width={77}
          height={87}
          className="absolute top-0 right-[8%] hidden w-14 md:block"
        />
        <h1 className="font-hand mb-4 text-center">
          wanna look @ our catalogs?
        </h1>
        <p className="mb-2 text-center">
          <Link
            href="/upload"
            className="font-hand text-quiet underline decoration-ink/30 underline-offset-4 hover:text-ink"
          >
            add a magazine
          </Link>
        </p>
        <div className="catalog-rail hide-scrollbar">
          {magazines.map((magazine) => (
            <div key={magazine.slug} className="relative shrink-0">
              <CatalogCard magazine={magazine} />
            </div>
          ))}
        </div>
      </main>
    </SiteShell>
  );
}
