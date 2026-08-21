"use client";

import { Avatar } from "@/components/ui/Avatar";
import type { PublicUser } from "@/lib/types";
import { CloseIcon } from "@/components/ui/icons";

export function SelectedChips({
  people,
  onRemove,
}: {
  people: PublicUser[];
  onRemove: (person: PublicUser) => void;
}) {
  if (people.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 px-5 pt-4">
      {people.map((person) => (
        <span
          key={person._id}
          className="flex items-center gap-1.5 bg-accent-soft py-1 pr-1 pl-1.5 text-[13px] text-ink"
        >
          <Avatar id={person._id} name={person.name} size={24} />
          <span className="max-w-[14ch] truncate">{person.name}</span>
          <button
            type="button"
            onClick={() => onRemove(person)}
            aria-label={`Remove ${person.name}`}
            className="flex size-5 items-center justify-center text-muted hover:bg-surface hover:text-ink"
          >
            <CloseIcon size={11} />
          </button>
        </span>
      ))}
    </div>
  );
}
