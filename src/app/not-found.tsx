import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <Wordmark size={20} />

      <div>
        <p className="text-meta text-faint">404</p>
        <h1 className="font-display mt-1 text-[26px] font-bold text-ink sm:text-[30px]">
          Nothing lives at this address
        </h1>
        <p className="mt-2 max-w-[42ch] text-[14.5px] text-muted">
          The page you asked for does not exist. Your conversations are untouched.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Link
          href="/app"
          className="inline-flex h-11 items-center bg-accent px-5 text-[14px] font-medium text-accent-ink transition-colors hover:bg-accent-hover"
        >
          Open Pulse
        </Link>
        <Link
          href="/"
          className="inline-flex h-11 items-center border border-line bg-surface px-5 text-[14px] font-medium text-ink transition-colors hover:border-line-strong"
        >
          Landing page
        </Link>
      </div>
    </main>
  );
}
