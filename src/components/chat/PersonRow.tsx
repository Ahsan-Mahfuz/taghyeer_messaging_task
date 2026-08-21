"use client";

import { Avatar } from "@/components/ui/Avatar";
import type { PublicUser } from "@/lib/types";

type PersonRowProps = {
  person: PublicUser;
  onSelect?: () => void;
  selected?: boolean;
  trailing?: React.ReactNode;
};

export function PersonRow({ person, onSelect, selected, trailing }: PersonRowProps) {
  const content = (
    <>
      <Avatar id={person._id} name={person.name} size={44} />
      <span className="min-w-0 flex-1 text-left">
        <span className="block truncate text-[14.5px] font-medium text-ink">{person.name}</span>
        <span className="text-meta block truncate text-muted">{person.phone}</span>
      </span>
      {trailing}
    </>
  );

  if (!onSelect) {
    return <div className="flex items-center gap-3 px-5 py-2.5">{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex w-full items-center gap-3 px-5 py-2.5 text-left transition-colors ${
        selected ? "bg-accent-soft" : "hover:bg-surface-2"
      }`}
    >
      {content}
    </button>
  );
}
