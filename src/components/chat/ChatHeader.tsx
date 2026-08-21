"use client";

import { Avatar } from "@/components/ui/Avatar";
import { useSession } from "@/hooks/useSession";
import { conversationTitle, isGroup, type Conversation } from "@/lib/types";
import { ChevronLeftIcon } from "@/components/ui/icons";

type ChatHeaderProps = {
  conversation: Conversation;
  onBack: () => void;
  onOpenInfo?: () => void;
};

export function ChatHeader({ conversation, onBack, onOpenInfo }: ChatHeaderProps) {
  const { user } = useSession();
  const title = conversationTitle(conversation);
  const group = isGroup(conversation);
  const avatarId = group ? conversation._id : conversation.participant._id;

  const subtitle = group
    ? conversation.participants
        .filter((member) => member._id !== user?._id)
        .map((member) => member.name)
        .concat("you")
        .join(", ")
    : conversation.participant.phone;

  return (
    <header className="flex h-[60px] shrink-0 items-center gap-3 border-b border-line bg-surface px-3 md:px-4">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to conversations"
        className="-ml-1 flex size-11 items-center justify-center text-muted hover:bg-surface-2 hover:text-ink md:hidden"
      >
        <ChevronLeftIcon size={18} />
      </button>

      <Avatar id={avatarId} name={title} size={36} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-ink">{title}</p>
        <p className={`truncate text-[12.5px] text-muted ${group ? "" : "font-mono tabular-nums"}`}>
          {subtitle}
        </p>
      </div>

      {onOpenInfo && (
        <button
          type="button"
          onClick={onOpenInfo}
          className="shrink-0 px-3 py-2 text-[13px] text-muted hover:bg-surface-2 hover:text-ink"
        >
          Group info
        </button>
      )}
    </header>
  );
}
