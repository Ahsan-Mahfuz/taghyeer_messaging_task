"use client";

import { useCallback, useRef } from "react";
import { makeLocalId } from "@/lib/messages";
import type { Id, Message } from "@/lib/types";

type OutboxOptions = {
  conversationId: Id | null;
  myId: Id | null;
  deliver: (conversationId: Id, text: string) => Promise<void>;
  onQueued: (message: Message) => void;
  onStateChange: (localId: string, state: Message["state"]) => void;
};

export function useOutbox({
  conversationId,
  myId,
  deliver,
  onQueued,
  onStateChange,
}: OutboxOptions) {
  const pending = useRef(new Map<string, string>());

  const attempt = useCallback(
    async (localId: string, text: string) => {
      if (!conversationId) return;
      try {
        await deliver(conversationId, text);
        onStateChange(localId, "sent");
        pending.current.delete(localId);
      } catch {
        onStateChange(localId, "failed");
      }
    },
    [conversationId, deliver, onStateChange],
  );

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || !conversationId || !myId) return;

      const localId = makeLocalId();
      pending.current.set(localId, text);
      onQueued({
        _id: localId,
        localId,
        conversation: conversationId,
        sender: myId,
        text,
        createdAt: new Date().toISOString(),
        state: "sending",
      });
      void attempt(localId, text);
    },
    [conversationId, myId, onQueued, attempt],
  );

  const retry = useCallback(
    (localId: string) => {
      const text = pending.current.get(localId);
      if (!text) return;
      onStateChange(localId, "sending");
      void attempt(localId, text);
    },
    [attempt, onStateChange],
  );

  return { send, retry };
}
