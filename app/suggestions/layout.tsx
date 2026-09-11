import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "suggestions",
};

export default function SuggestionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
