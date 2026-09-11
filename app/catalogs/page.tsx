import { Burst, Doodle } from "@/components/Doodle";
import { CatalogCard } from "@/components/CatalogCard";
import { SiteShell } from "@/components/SiteShell";
import { getMagazines } from "@/lib/magazines";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "catalogs",
};

export default async function CatalogsPage() {
  const magazines = await getMagazines();

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
        <div className="hide-scrollbar flex snap-x snap-mandatory gap-10 overflow-x-auto px-[max(1rem,calc(50%-560px))] pt-12 pb-10">
          {magazines.map((magazine) => (
            <div key={magazine.slug} className="relative">
              {magazine.month === "august" ? (
                <Burst className="absolute -bottom-2 -left-6 h-8 w-8" />
              ) : null}
              <CatalogCard magazine={magazine} />
            </div>
          ))}
        </div>
      </main>
    </SiteShell>
  );
}
