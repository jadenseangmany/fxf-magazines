import { Burst, Doodle } from "@/components/Doodle";
import { SiteShell } from "@/components/SiteShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "about",
};

const team = [
  {
    name: "madi",
    mbti: "ESFJ",
    hobbies: "golf, doodling, rock climbing, and crafts",
    description:
      "im an 04 korean american and i am recently graduated ucsd! im interested in interior design, movies, and want to be a product designer or manager",
    portrait: "/doodles/about/madi.png",
    portraitSize: { width: 124, height: 141 },
    accent: "/doodles/about/apple.png",
    accentSize: { width: 128, height: 102 },
  },
  {
    name: "sally",
    mbti: "",
    hobbies: "",
    description: "",
    portrait: "/doodles/about/sally.png",
    portraitSize: { width: 143, height: 143 },
    accent: "/doodles/about/hearts.png",
    accentSize: { width: 85, height: 115 },
  },
  {
    name: "vicky",
    mbti: "",
    hobbies: "",
    description: "",
    portrait: "/doodles/about/vicky.png",
    portraitSize: { width: 134, height: 140 },
    accent: "/doodles/about/bow.png",
    accentSize: { width: 116, height: 120 },
  },
] as const;

export default function AboutPage() {
  return (
    <SiteShell>
      <main className="relative mx-auto mt-10 w-full max-w-5xl">
        <Doodle
          src="/doodles/about/stars.png"
          width={121}
          height={115}
          className="absolute -top-4 -right-2 hidden w-[88px] md:block"
        />
        <h1 className="font-hand mb-8 text-center">meet our lil team</h1>

        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {team.map((person, index) => (
            <section key={person.name} className="relative">
              {index === 0 ? (
                <Burst className="absolute -top-5 -left-6 h-8 w-8" />
              ) : null}
              {index === 2 ? (
                <Burst className="absolute top-[38%] -right-6 hidden h-8 w-8 md:block" />
              ) : null}
              <div className="aspect-[4/3.4] w-full bg-fill" />
              <h2 className="font-hand mt-4">{person.name}</h2>
              <div className="mt-2 space-y-1 text-[15px] leading-snug">
                <p>
                  <span className="font-medium">mbti:</span> {person.mbti}
                </p>
                <p>
                  <span className="font-medium">hobbies:</span>
                  {person.hobbies ? ` ${person.hobbies}` : null}
                </p>
                <p>
                  <span className="font-medium">description:</span>
                  {person.description ? ` ${person.description}` : null}
                </p>
              </div>
              <div className="mt-6 flex items-end gap-2">
                <Doodle
                  src={person.portrait}
                  width={person.portraitSize.width}
                  height={person.portraitSize.height}
                  className="w-[110px]"
                />
                <Doodle
                  src={person.accent}
                  width={person.accentSize.width}
                  height={person.accentSize.height}
                  className="w-[90px]"
                />
              </div>
            </section>
          ))}
        </div>

        <div className="relative mt-16">
          <Doodle
            src="/doodles/about/stars-1.png"
            width={121}
            height={115}
            className="absolute top-2 -left-4 hidden w-[88px] md:block lg:-left-24"
          />
          <p className="mx-auto max-w-[340px] text-[16px] leading-relaxed">
            we all met in college and we were just looking for a reason to stay
            productive but also connected. i think that overall it is a cute
            project that can also be a third space for us to just get updates on
            how everyone is doing also have a fun time reading and looking at the
            magazines :)
          </p>
          <p className="mx-auto mt-6 max-w-[340px] text-[16px] leading-relaxed">
            p.s. — we always want more ideas lol if you have any
          </p>
        </div>
      </main>
    </SiteShell>
  );
}
