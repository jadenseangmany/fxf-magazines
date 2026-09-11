import { Burst, Doodle, Sparkle } from "@/components/Doodle";
import { HeartMark, StarMark, TargetMark } from "@/components/Marks";
import { PdfThumb } from "@/components/PdfThumb";
import { SiteShell } from "@/components/SiteShell";
import { getMagazines, latestPublished } from "@/lib/magazines";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const magazines = await getMagazines();
  const featured = latestPublished(magazines);

  return (
    <SiteShell>
      <main className="mt-8 sm:mt-10">
        <div className="relative mx-auto w-full max-w-[920px]">
          <Doodle
            src="/doodles/home/stars.png"
            width={121}
            height={115}
            className="absolute top-[18%] left-0 hidden w-[88px] md:block"
          />
          <div className="absolute bottom-[8%] left-2 hidden items-end gap-1 md:flex lg:left-8">
            <Doodle
              src="/doodles/home/button.png"
              width={82}
              height={81}
              className="mb-1 w-14"
            />
            <Doodle
              src="/doodles/home/character.png"
              width={115}
              height={132}
              className="w-[92px]"
            />
          </div>
          <Doodle
            src="/doodles/home/matcha.png"
            width={77}
            height={87}
            className="absolute top-[6%] right-6 hidden w-14 md:block lg:right-16"
          />
          <Sparkle className="absolute top-[28%] right-[18%] hidden h-11 w-11 md:block" />

          <div className="relative mx-auto max-w-[320px]">
            <Burst className="absolute top-1 -left-9 h-8 w-8" />
            <h1 className="font-hand mb-4">this month’s magazine:</h1>
            <Link
              href={featured ? `/catalogs/${featured.slug}` : "/catalogs"}
              className="relative block"
            >
              <Sparkle className="absolute -top-5 -right-10 hidden h-12 w-12 sm:block" />
              {featured?.cover ? (
                <Image
                  src={featured.cover}
                  alt="this month’s magazine"
                  width={320}
                  height={428}
                  className="aspect-[3/4.25] w-full object-cover"
                  priority
                />
              ) : featured?.pdf ? (
                <PdfThumb
                  src={featured.pdf}
                  alt="this month’s magazine"
                  className="aspect-[3/4.25] w-full"
                />
              ) : (
                <div className="aspect-[3/4.25] w-full bg-fill" />
              )}
              <Burst className="absolute right-[-1.75rem] bottom-12 h-7 w-7" />
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-[320px]">
          <p>
            established in 2026, we are just{" "}
            <span className="font-medium">making a little magazine</span> that can
            make a space for monthly updates, create a community of connection for
            our long distance friends :))
          </p>

          <h2 className="font-hand mt-8 underline decoration-ink/40 underline-offset-4">
            what we do
          </h2>
          <ul className="mt-4 space-y-3">
            <li className="flex items-center gap-3">
              <StarMark /> monthly magazines
            </li>
            <li className="flex items-center gap-3">
              <TargetMark /> meet ups when we can
            </li>
            <li className="flex items-center gap-3">
              <HeartMark /> career talks and work time
            </li>
          </ul>

          <p className="mt-8">
            we want to just keep our friendship close no matter the distance. we
            want to eventually create home cafes, in person hangouts and just be
            able to keep close with the people we love!
          </p>
        </div>
      </main>
    </SiteShell>
  );
}
