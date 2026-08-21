"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { mergeMessages } from "@/lib/messages";
import type { Id, Message, MessagePage } from "@/lib/types";
import { useChat } from "./useChat";
import { useOutbox } from "./useOutbox";
import { useSession } from "./useSession";

const PAGE_SIZE = 30;

export function useMessages(conversationId: Id | null) {
  const { session, signOut } = useSession();
  const { onIncoming, sendOverSocket } = useChat();
  const token = session?.token ?? null;

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [olderError, setOlderError] = useState(false);

  const applyPage = useCallback((page: MessagePage) => {
    setMessages(page.messages);
    setHasMore(page.hasMore);
    setError(null);
    setLoading(false);
  }, []);

  const applyFailure = useCallback(
    (cause: unknown) => {
      if (cause instanceof ApiError && cause.sessionExpired) signOut();
      else setError(cause instanceof Error ? cause.message : "This conversation would not load.");
      setLoading(false);
    },
    [signOut],
  );

  useEffect(() => {
    if (!token || !conversationId) return;
    let alive = true;
    api
      .messages(token, conversationId, { limit: PAGE_SIZE })
      .then((page) => alive && applyPage(page))
      .catch((cause) => alive && applyFailure(cause));
    return () => {
      alive = false;
    };
  }, [token, conversationId, applyPage, applyFailure]);

  useEffect(
    () =>
      onIncoming((message) => {
        if (message.conversation !== conversationId) return;
        setMessages((current) => mergeMessages(current, [message]));
      }),
    [onIncoming, conversationId],
  );

  const reload = useCallback(() => {
    if (!token || !conversationId) return;
    setLoading(true);
    setError(null);
    api.messages(token, conversationId, { limit: PAGE_SIZE }).then(applyPage).catch(applyFailure);
  }, [token, conversationId, applyPage, applyFailure]);

  const loadOlder = useCallback(async () => {
    if (!token || !conversationId || loadingOlder || !hasMore) return;
    const oldest = messages.find((message) => !message.localId);
    if (!oldest) return;

    setLoadingOlder(true);
    setOlderError(false);
    try {
      const page = await api.messages(token, conversationId, {
        limit: PAGE_SIZE,
        before: oldest._id,
      });
      setMessages((current) => mergeMessages(page.messages, current));
      setHasMore(page.hasMore);
    } catch {
      setOlderError(true);
    } finally {
      setLoadingOlder(false);
    }
  }, [token, conversationId, loadingOlder, hasMore, messages]);

  const markState = useCallback((localId: string, state: Message["state"]) => {
    setMessages((current) =>
      current.map((message) => (message.localId === localId ? { ...message, state } : message)),
    );
  }, []);

  const queue = useCallback((message: Message) => {
    setMessages((current) => [...current, message]);
  }, []);

  const { send, retry } = useOutbox({
    conversationId,
    myId: session?.user._id ?? null,
    deliver: sendOverSocket,
    onQueued: queue,
    onStateChange: markState,
  });

  return {
    messages,
    loading,
    error,
    hasMore,
    loadingOlder,
    olderError,
    loadOlder,
    send,
    retry,
    reload,
  };
}
