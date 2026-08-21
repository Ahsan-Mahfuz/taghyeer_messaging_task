import Link from "next/link";
import { LiveThread } from "./LiveThread";

const CHIPS = ["01... or +8801...", "no password", "free"];

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-14 pb-16 md:pt-20">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div>
          <span className="text-meta inline-flex items-center gap-2 bg-accent-soft px-3 py-1 text-accent">
            <span aria-hidden className="size-1.5 animate-pulse bg-current" />
            websocket, not polling
          </span>

          <h1 className="mt-5 font-display text-[40px] leading-[1.05] font-bold tracking-tight text-ink sm:text-[52px]">
            Your number is
            <br />
            your account.
          </h1>

          <p className="mt-5 max-w-[46ch] text-[16px] leading-relaxed text-muted">
            No password to forget, no email to verify, no six-digit code to go hunting for. Type
            your number, pick the name your friends will see, and you are in the conversation.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/app"
              className="inline-flex h-12 items-center bg-accent px-6 text-[14.5px] font-medium text-accent-ink shadow-e2 transition-colors hover:bg-accent-hover"
            >
              Start chatting
            </Link>
            <div className="flex flex-wrap gap-1.5">
              {CHIPS.map((chip) => (
                <span key={chip} className="text-meta border border-line px-3 py-1.5 text-muted">
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        <LiveThread />
      </div>
    </section>
  );
}
