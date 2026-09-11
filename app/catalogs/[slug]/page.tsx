import { Burst, Doodle } from "@/components/Doodle";
import { CommentThread } from "@/components/CommentThread";
import { IssueReader } from "@/components/IssueReader";
import { SiteShell } from "@/components/SiteShell";
import { getComments } from "@/lib/comments";
import { titleCaseMonth } from "@/lib/format";
import { getMagazine } from "@/lib/magazines";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type IssuePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: IssuePageProps): Promise<Metadata> {
  const { slug } = await params;
  const magazine = await getMagazine(slug);
  if (!magazine) return { title: "magazine" };
  return { title: `${magazine.month} issue` };
}

export default async function IssuePage({ params }: IssuePageProps) {
  const { slug } = await params;
  const magazine = await getMagazine(slug);
  if (!magazine || magazine.status === "coming-soon") notFound();

  const comments = await getComments(slug);
  const monthName = titleCaseMonth(magazine.month);

  return (
    <SiteShell>
      <main className="relative mx-auto mt-8 w-full max-w-5xl">
        <Doodle
          src="/doodles/catalog-2/stars.png"
          width={121}
          height={115}
          className="absolute top-24 -right-2 hidden w-[90px] lg:block"
        />
        <Burst className="absolute top-8 right-[30%] hidden h-9 w-9 lg:block" />
        <h1 className="font-hand mb-10 text-center">
          check out our{" "}
          <span className="underline underline-offset-4">{monthName}</span> issue
        </h1>

        <div className="grid items-start gap-10 lg:grid-cols-[320px_minmax(0,1fr)] lg:justify-center lg:gap-16">
          <div className="relative flex flex-col items-center lg:items-start">
            <Doodle
              src="/doodles/catalog-2/stars-1.png"
              width={121}
              height={115}
              className="absolute top-36 -left-24 hidden w-[90px] md:block"
            />
            <IssueReader magazine={magazine} />
            <Doodle
              src="/doodles/catalog-2/rabbits.png"
              width={299}
              height={96}
              className="mt-4 w-[220px]"
            />
            {magazine.blurb ? (
              <p className="mt-6 max-w-[280px] text-[16px] leading-relaxed">
                {magazine.blurb}
              </p>
            ) : null}
            {magazine.question ? (
              <div className="mt-6 max-w-[280px]">
                <p className="font-medium">question of the month:</p>
                <p className="mt-1">• {magazine.question}</p>
              </div>
            ) : null}
          </div>

          <div className="flex justify-center lg:justify-start">
            <CommentThread slug={slug} initialComments={comments} />
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
