import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-line py-8">
      <nav className="mx-auto flex max-w-6xl justify-center gap-6 px-5 text-[13px] text-muted">
        <a href="#how" className="hover:text-ink">
          How it works
        </a>
        <a href="#features" className="hover:text-ink">
          Features
        </a>
        <Link href="/app" className="hover:text-ink">
          Open Pulse
        </Link>
      </nav>
    </footer>
  );
}
