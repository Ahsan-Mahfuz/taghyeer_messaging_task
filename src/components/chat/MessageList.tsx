"use client";

import type { RefObject } from "react";
import { useSession } from "@/hooks/useSession";
import { startsNewDay, startsNewRun, formatDay } from "@/lib/time";
import { conversationMembers, isGroup, type Conversation, type Message } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { MessageBubble } from "./MessageBubble";
import { ThreadSkeleton } from "./ThreadSkeleton";
import { ThreadTop } from "./ThreadTop";

type Thread = {
  messages: Message[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadingOlder: boolean;
  olderError: boolean;
  retry: (localId: string) => void;
  reload: () => void;
};

type MessageListProps = {
  conversation: Conversation;
  thread: Thread;
  onLoadOlder: () => void;
  viewportRef: RefObject<HTMLDivElement | null>;
  onScroll: () => void;
};

export function MessageList({
  conversation,
  thread,
  onLoadOlder,
  viewportRef,
  onScroll,
}: MessageListProps) {
  const { user } = useSession();
  const group = isGroup(conversation);
  const byId = new Map(conversationMembers(conversation).map((m) => [m._id, m]));

  if (thread.loading) return <ThreadSkeleton />;

  if (thread.error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-8 text-center">
        <p className="text-[15px] font-medium text-ink">This conversation would not load</p>
        <p className="max-w-[42ch] text-[14px] text-muted">
          Nothing was lost. Reload to try again, or pick another conversation from the list.
        </p>
        <Button variant="secondary" onClick={thread.reload} className="mt-3">
          Reload
        </Button>
      </div>
    );
  }

  if (thread.messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-1.5 px-8 text-center">
        <p className="text-[15px] font-medium text-ink">No messages yet</p>
        <p className="max-w-[40ch] text-[14px] text-muted">
          {group
            ? "Say something and everyone here will see it."
            : `Say something and it will appear here.`}
        </p>
        {!group && <p className="text-meta mt-1 text-faint">{conversation.participant.phone}</p>}
      </div>
    );
  }

  return (
    <div
      ref={viewportRef}
      onScroll={onScroll}
      className="h-full overflow-y-auto overscroll-contain px-4 py-3 md:px-6"
    >
      <ThreadTop
        hasMore={thread.hasMore}
        loading={thread.loadingOlder}
        failed={thread.olderError}
        onLoad={onLoadOlder}
      />

      {thread.messages.map((message, index) => {
        const previous = thread.messages[index - 1];
        const newDay = startsNewDay(message.createdAt, previous?.createdAt);
        const newRun = newDay || startsNewRun(message, previous);
        const mine = message.sender === user?._id;

        return (
          <div key={message._id}>
            {newDay && (
              <p className="text-meta my-4 text-center text-faint">
                {formatDay(message.createdAt)}
              </p>
            )}
            <MessageBubble
              message={message}
              mine={mine}
              startsRun={newRun}
              showSender={group && !mine && newRun}
              sender={byId.get(message.sender)}
              onRetry={thread.retry}
            />
          </div>
        );
      })}
    </div>
  );
}
