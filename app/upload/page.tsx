import { UploadForm } from "@/components/UploadForm";
import { SiteShell } from "@/components/SiteShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "add a magazine",
};

export default function UploadPage() {
  return (
    <SiteShell>
      <main className="mx-auto mt-12 max-w-[420px]">
        <h1 className="font-hand mb-3">add a magazine</h1>
        <p className="mb-8 text-[16px] leading-relaxed">
          anyone can drop a monthly pdf. pick the month and year — if it’s the
          newest one, it becomes this month’s magazine on the home page and
          sits first in the catalogs.
        </p>
        <UploadForm />
      </main>
    </SiteShell>
  );
}
