import Link from "next/link";

export function ClosingCta() {
  return (
    <section className="border-t border-line bg-accent-soft/60 py-16 md:py-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-5 text-center">
        <span className="mb-5 flex items-center gap-1" aria-hidden>
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="size-2 animate-bounce bg-accent"
              style={{ animationDelay: `${index * 140}ms`, animationDuration: "1.1s" }}
            />
          ))}
        </span>

        <h2 className="font-display text-[30px] leading-tight font-bold tracking-tight text-ink sm:text-[38px]">
          Someone is already typing.
        </h2>
        <p className="mt-3 max-w-[44ch] text-[15px] text-muted">
          Takes about ten seconds. You already know your phone number.
        </p>

        <Link
          href="/app"
          className="mt-7 inline-flex h-12 items-center bg-accent px-7 text-[14.5px] font-medium text-accent-ink shadow-e2 transition-colors hover:bg-accent-hover"
        >
          Start chatting
        </Link>
      </div>
    </section>
  );
}
