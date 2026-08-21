"use client";

import { useMemo, useState } from "react";
import { useChat } from "@/hooks/useChat";
import { conversationTitle } from "@/lib/types";
import { Wordmark } from "@/components/ui/Wordmark";
import { Button } from "@/components/ui/Button";
import { ComposeIcon, UsersIcon } from "@/components/ui/icons";
import { ConversationRow } from "./ConversationRow";
import { CurrentUser } from "./CurrentUser";
import { SidebarSkeleton } from "./SidebarSkeleton";

export function Sidebar({
  onNewChat,
  onNewGroup,
}: {
  onNewChat: () => void;
  onNewGroup: () => void;
}) {
  const { conversations, loading, error, reload, activeId, open, unread } = useChat();
  const [filter, setFilter] = useState("");

  const visible = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) return conversations;
    return conversations.filter((c) => conversationTitle(c).toLowerCase().includes(term));
  }, [conversations, filter]);

  return (
    <aside className="flex h-full flex-col bg-surface-2">
      <header className="px-4 pt-4 pb-3">
        <Wordmark />
      </header>

      <div className="flex gap-2 px-4 pb-3">
        <Button onClick={onNewChat} className="!h-11 flex-1">
          <ComposeIcon size={16} />
          New chat
        </Button>
        <Button variant="secondary" onClick={onNewGroup} className="!h-11 flex-1">
          <UsersIcon size={16} />
          New group
        </Button>
      </div>

      <div className="px-4 pb-3">
        <input
          type="search"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder="Search your chats"
          aria-label="Search your chats"
          className="h-12 w-full border border-line bg-surface px-3.5 text-[14px] text-ink placeholder:text-faint hover:border-line-strong"
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading && <SidebarSkeleton />}

        {!loading && error && (
          <div className="px-4 py-8 text-center">
            <p className="text-[14.5px] font-medium text-ink">Could not load conversations</p>
            <p className="mt-1 text-[13px] text-muted">
              The server did not respond. Your messages are safe.
            </p>
            <Button variant="secondary" onClick={reload} className="mt-4">
              Try again
            </Button>
          </div>
        )}

        {!loading && !error && conversations.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-[14.5px] font-medium text-ink">No conversations yet</p>
            <p className="mt-1 text-[13px] text-muted">
              Start one with a phone number, or make a group.
            </p>
            <Button onClick={onNewChat} className="mt-4">
              New chat
            </Button>
          </div>
        )}

        {!loading && !error && conversations.length > 0 && visible.length === 0 && (
          <p className="px-4 py-8 text-center text-[13px] text-muted">
            Nothing here matches &ldquo;{filter.trim()}&rdquo;.
          </p>
        )}

        <ul>
          {visible.map((conversation) => (
            <ConversationRow
              key={conversation._id}
              conversation={conversation}
              active={conversation._id === activeId}
              unread={unread[conversation._id] ?? 0}
              onOpen={() => open(conversation._id)}
            />
          ))}
        </ul>
      </div>

      <CurrentUser />
    </aside>
  );
}
