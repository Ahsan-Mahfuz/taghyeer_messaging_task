"use client";

import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { useMessages } from "@/hooks/useMessages";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { isGroup, type Conversation } from "@/lib/types";
import { ChatHeader } from "./ChatHeader";
import { ConnectionBanner } from "./ConnectionBanner";
import { MessageList } from "./MessageList";
import { Composer } from "./Composer";
import { JumpToLatest } from "./JumpToLatest";
import { GroupInfoPanel } from "./GroupInfoPanel";

export function ChatPanel({
  conversation,
  onBack,
}: {
  conversation: Conversation;
  onBack: () => void;
}) {
  const { connection, attempt } = useChat();
  const [infoOpen, setInfoOpen] = useState(false);
  const thread = useMessages(conversation._id);

  const latest = thread.messages[thread.messages.length - 1];
  const scroll = useAutoScroll(latest?._id);

  async function loadOlder() {
    scroll.captureBeforeOlder();
    await thread.loadOlder();
  }

  return (
    <div className="flex h-full min-w-0">
      <section className="flex min-w-0 flex-1 flex-col bg-bg">
        <ChatHeader
          conversation={conversation}
          onBack={onBack}
          onOpenInfo={isGroup(conversation) ? () => setInfoOpen(true) : undefined}
        />

        <ConnectionBanner state={connection} attempt={attempt} />

        <div className="relative min-h-0 flex-1">
          <MessageList
            conversation={conversation}
            thread={thread}
            onLoadOlder={loadOlder}
            viewportRef={scroll.viewportRef}
            onScroll={scroll.onScroll}
          />
          {!scroll.pinned && thread.messages.length > 0 && (
            <JumpToLatest count={scroll.missed} onClick={() => scroll.scrollToLatest()} />
          )}
        </div>

        <Composer
          conversationName={
            isGroup(conversation) ? conversation.name : conversation.participant.name
          }
          disabled={Boolean(thread.error)}
          onSend={(text) => {
            thread.send(text);
            scroll.scrollToLatest("auto");
          }}
        />
      </section>

      {infoOpen && isGroup(conversation) && (
        <GroupInfoPanel conversation={conversation} onClose={() => setInfoOpen(false)} />
      )}
    </div>
  );
}
