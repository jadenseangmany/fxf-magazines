import { SiteShell } from "@/components/SiteShell";
import Link from "next/link";

export default function NotFound() {
  return (
    <SiteShell>
      <main className="mx-auto mt-20 max-w-[340px] text-center">
        <h1 className="font-hand mb-4">this page wandered off</h1>
        <Link href="/" className="underline underline-offset-4">
          back home
        </Link>
      </main>
    </SiteShell>
  );
}
