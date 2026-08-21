"use client";

import { Spinner } from "@/components/ui/Button";

type ThreadTopProps = {
  hasMore: boolean;
  loading: boolean;
  failed: boolean;
  onLoad: () => void;
};

export function ThreadTop({ hasMore, loading, failed, onLoad }: ThreadTopProps) {
  if (loading) {
    return (
      <p className="flex items-center justify-center gap-2 py-3 text-[13px] text-muted">
        <Spinner size={12} />
        Loading older messages
      </p>
    );
  }

  if (failed) {
    return (
      <p className="flex items-center justify-center gap-2 py-3 text-[13px] text-danger">
        Could not load older messages
        <button
          type="button"
          onClick={onLoad}
          className="font-medium underline underline-offset-2 hover:no-underline"
        >
          Retry
        </button>
      </p>
    );
  }

  if (!hasMore) {
    return <p className="text-meta py-3 text-center text-faint">Start of conversation</p>;
  }

  return (
    <div className="flex justify-center py-3">
      <button
        type="button"
        onClick={onLoad}
        className="border border-line bg-surface px-4 py-1.5 text-[13px] text-muted hover:border-line-strong hover:text-ink"
      >
        Load older messages
      </button>
    </div>
  );
}
