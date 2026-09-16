import Link from "next/link";

const links = [
  { href: "/", label: "home" },
  { href: "/about", label: "about" },
  { href: "/catalogs", label: "catalogs" },
  { href: "/suggestions", label: "suggestions" },
] as const;

export function SiteHeader() {
  return (
    <header className="relative z-20 pt-10 text-center sm:pt-12">
      <Link href="/" className="font-display inline-block tracking-tight">
        friends x friends
      </Link>
      <nav className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-2 sm:gap-x-14">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-hand text-ink/90 underline decoration-ink/40 underline-offset-4 transition-opacity hover:opacity-60"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
