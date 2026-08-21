"use client";

import { Avatar } from "@/components/ui/Avatar";
import { formatListStamp } from "@/lib/time";
import { conversationTitle, isGroup, type Conversation } from "@/lib/types";

type ConversationRowProps = {
  conversation: Conversation;
  active: boolean;
  unread: number;
  onOpen: () => void;
};

export function ConversationRow({ conversation, active, unread, onOpen }: ConversationRowProps) {
  const title = conversationTitle(conversation);
  const preview = conversation.lastMessage?.text?.trim();
  const stamp = formatListStamp(conversation.lastMessage?.createdAt ?? conversation.updatedAt);
  const avatarId = isGroup(conversation) ? conversation._id : conversation.participant._id;

  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        aria-current={active ? "true" : undefined}
        className={`relative flex h-[54px] w-full items-center gap-3 px-4 text-left transition-colors ${
          active ? "bg-accent-soft" : "hover:bg-surface"
        }`}
      >
        {active && <span className="absolute inset-y-0 left-0 w-[2.5px] bg-accent" />}

        <Avatar id={avatarId} name={title} size={36} />

        <span className="min-w-0 flex-1">
          <span className="flex items-baseline gap-2">
            <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-ink">
              {title}
            </span>
            <span className="text-meta shrink-0 text-faint">{stamp}</span>
          </span>
          <span
            className={`block truncate text-[13px] ${preview ? "text-muted" : "text-faint italic"}`}
          >
            {preview || "No messages yet"}
          </span>
        </span>

        {unread > 0 && (
          <span className="text-meta flex h-5 min-w-5 items-center justify-center bg-accent px-1.5 font-medium text-accent-ink">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>
    </li>
  );
}
