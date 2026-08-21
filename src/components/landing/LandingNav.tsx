import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
];

export function LandingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-bg/85 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:h-16 sm:gap-6 sm:px-5">
        <Link href="/" aria-label="Pulse home" className="shrink-0">
          <Wordmark size={18} />
        </Link>

        <div className="ml-auto hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13.5px] text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 md:ml-0 md:gap-2 md:border-l md:border-line md:pl-6">
          <ThemeToggle />
          <Link
            href="/app"
            className="inline-flex h-9 items-center bg-accent px-3.5 text-[13px] font-medium whitespace-nowrap text-accent-ink transition-colors hover:bg-accent-hover sm:px-4"
          >
            Open Pulse
          </Link>
        </div>
      </nav>
    </header>
  );
}
