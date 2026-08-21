"use client";

export function JumpToLatest({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="animate-rise absolute bottom-4 left-1/2 flex h-9 -translate-x-1/2 items-center gap-2 bg-surface px-4 text-[13px] font-medium text-ink shadow-e2 ring-1 ring-line hover:bg-surface-2"
    >
      Jump to latest
      {count > 0 && (
        <span className="text-meta flex h-5 min-w-5 items-center justify-center bg-accent px-1.5 text-accent-ink">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
