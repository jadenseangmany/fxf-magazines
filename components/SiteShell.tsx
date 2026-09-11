import { SiteHeader } from "@/components/SiteHeader";

export function SiteShell({
  children,
  doodles,
}: {
  children: React.ReactNode;
  doodles?: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-paper">
      {doodles}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-20">
        <SiteHeader />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
