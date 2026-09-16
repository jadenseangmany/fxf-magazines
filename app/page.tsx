import { Doodle } from "@/components/Doodle";
import { HeartMark, StarMark, TargetMark } from "@/components/Marks";
import { PdfThumb } from "@/components/PdfThumb";
import { SiteShell } from "@/components/SiteShell";
import { getMagazines, latestPublished } from "@/lib/magazines";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const magazines = await getMagazines();
  const featured = latestPublished(magazines);

  return (
    <SiteShell>
      <main className="mt-8 sm:mt-10">
        <div className="relative mx-auto w-full max-w-[1080px] pt-4">
          <Doodle
            src="/doodles/home/stars.png"
            width={121}
            height={115}
            className="absolute top-[30%] left-0 hidden w-[88px] sm:block"
          />
          <Doodle
            src="/doodles/home/doggie.png"
            width={149}
            height={106}
            className="absolute top-[18%] left-[6%] hidden w-[108px] sm:block lg:left-[11%]"
          />
          <div className="absolute bottom-[4%] left-1 hidden items-end gap-0 sm:flex lg:left-[9%]">
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
            className="absolute top-[2%] right-[10%] hidden w-14 sm:block lg:right-[15%]"
          />
          <Doodle
            src="/doodles/home/hari clips.png"
            width={133}
            height={139}
            className="absolute top-[34%] right-[7%] hidden w-[92px] sm:block lg:right-[11%]"
          />
          <Doodle
            src="/doodles/home/sailboat.png"
            width={120}
            height={139}
            className="absolute top-[48%] right-0 hidden w-[86px] sm:block lg:right-1"
          />

          <div className="relative mx-auto max-w-[320px]">
            <Doodle
              src="/doodles/sparkle-2.png"
              width={40}
              height={66}
              className="absolute top-1 -left-10 hidden w-8 sm:block"
            />
            <h1 className="font-hand mb-4">this month’s magazine:</h1>
            <Link
              href={featured ? `/catalogs/${featured.slug}` : "/catalogs"}
              className="relative block"
            >
              <Doodle
                src="/doodles/sparkle-2.png"
                width={40}
                height={66}
                className="absolute -top-7 -right-11 hidden w-9 sm:block"
              />
              <Doodle
                src="/doodles/home/star-1.png"
                width={107}
                height={127}
                className="absolute -top-3 -right-7 z-10 hidden w-[70px] sm:block"
              />
              <Doodle
                src="/doodles/home/star-2.png"
                width={47}
                height={73}
                className="absolute top-10 -right-9 z-10 hidden w-8 sm:block"
              />
              {featured?.cover ? (
                <div className="relative aspect-[3/4.25] w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featured.cover}
                    alt="this month’s magazine"
                    width={320}
                    height={428}
                    style={{ width: "100%", height: "100%", objectFit: "fill" }}
                  />
                </div>
              ) : featured?.pdf ? (
                <div className="relative aspect-[3/4.25] w-full overflow-hidden">
                  <PdfThumb
                    src={featured.pdf}
                    alt="this month’s magazine"
                    className="h-full w-full"
                  />
                </div>
              ) : (
                <div className="aspect-[3/4.25] w-full bg-fill" />
              )}
              <Doodle
                src="/doodles/sparkle-1.png"
                width={31}
                height={49}
                className="absolute right-[-1.6rem] bottom-12 hidden w-7 sm:block"
              />
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
