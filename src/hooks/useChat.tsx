"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { applyLastMessage, bumpUnread, mergeConversation, stillAMember } from "@/lib/conversations";
import type { ChatState, Conversation, Id, Message } from "@/lib/types";
import { useChatSocket } from "./useChatSocket";
import { useConversationList } from "./useConversationList";
import { useSession } from "./useSession";

const Context = createContext<ChatState | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { session, signOut } = useSession();
  const token = session?.token ?? null;
  const myId = session?.user._id ?? null;

  const { conversations, setConversations, loading, error, reload } = useConversationList(
    token,
    signOut,
  );
  const [unread, setUnread] = useState<Record<Id, number>>({});
  const [activeId, setActiveId] = useState<Id | null>(null);

  const listeners = useRef(new Set<(message: Message) => void>());
  const knownIds = useRef<Set<Id>>(new Set());
  const activeIdRef = useRef<Id | null>(null);

  useEffect(() => {
    knownIds.current = new Set(conversations.map((item) => item._id));
  }, [conversations]);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  const upsert = useCallback(
    (incoming: Conversation) => {
      if (!stillAMember(incoming, myId)) {
        setConversations((list) => list.filter((item) => item._id !== incoming._id));
        setActiveId((current) => (current === incoming._id ? null : current));
        return;
      }
      setConversations((list) => mergeConversation(list, incoming));
    },
    [myId, setConversations],
  );

  const receive = useCallback(
    (message: Message) => {
      if (knownIds.current.has(message.conversation)) {
        setConversations((list) => applyLastMessage(list, message));
      } else {
        reload();
      }
      if (message.conversation !== activeIdRef.current) {
        setUnread((counts) => bumpUnread(counts, message.conversation));
      }
      listeners.current.forEach((listener) => listener(message));
    },
    [reload, setConversations],
  );

  const { connection, attempt, send } = useChatSocket({
    token,
    onMessage: receive,
    onConversation: upsert,
    onRejected: signOut,
  });

  const open = useCallback((id: Id | null) => {
    setActiveId(id);
    if (id) setUnread((counts) => ({ ...counts, [id]: 0 }));
  }, []);

  const onIncoming = useCallback((listener: (message: Message) => void) => {
    listeners.current.add(listener);
    return () => listeners.current.delete(listener);
  }, []);

  const value = useMemo(
    () => ({
      conversations,
      loading,
      error,
      connection,
      attempt,
      unread,
      activeId,
      open,
      reload,
      upsert,
      sendOverSocket: send,
      onIncoming,
    }),
    [
      conversations,
      loading,
      error,
      connection,
      attempt,
      unread,
      activeId,
      open,
      reload,
      upsert,
      send,
      onIncoming,
    ],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useChat(): ChatState {
  const value = useContext(Context);
  if (!value) throw new Error("useChat must be used inside ChatProvider");
  return value;
}
