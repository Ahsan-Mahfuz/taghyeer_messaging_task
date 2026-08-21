"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import type { Conversation } from "@/lib/types";

export function useConversationList(token: string | null, onExpired: () => void) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applyList = useCallback((list: Conversation[]) => {
    setConversations(list);
    setError(null);
    setLoading(false);
  }, []);

  const applyFailure = useCallback(
    (cause: unknown) => {
      if (cause instanceof ApiError && cause.sessionExpired) onExpired();
      else setError(cause instanceof Error ? cause.message : "Could not load conversations.");
      setLoading(false);
    },
    [onExpired],
  );

  useEffect(() => {
    if (!token) return;
    let alive = true;
    api
      .conversations(token)
      .then((list) => alive && applyList(list))
      .catch((cause) => alive && applyFailure(cause));
    return () => {
      alive = false;
    };
  }, [token, applyList, applyFailure]);

  const reload = useCallback(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    api.conversations(token).then(applyList).catch(applyFailure);
  }, [token, applyList, applyFailure]);

  return { conversations, setConversations, loading, error, reload };
}
