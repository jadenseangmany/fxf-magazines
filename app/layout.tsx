import type { Metadata } from "next";
import { DM_Sans, Mali, Schoolbell } from "next/font/google";
import "./globals.css";

const mali = Mali({
  variable: "--font-mali-src",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const schoolbell = Schoolbell({
  variable: "--font-schoolbell-src",
  subsets: ["latin"],
  weight: "400",
});

const dmSans = DM_Sans({
  variable: "--font-dm-src",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "friends x friends",
    template: "%s · friends x friends",
  },
  description:
    "a little magazine and community center for long distance friends.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${mali.variable} ${schoolbell.variable} ${dmSans.variable} h-full`}
    >
      <body className="min-h-full bg-paper font-dm text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
