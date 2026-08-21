"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { connectSocket, type ChatSocket } from "@/lib/socket";
import type { ConnectionState, Conversation, Id, Message } from "@/lib/types";

type SocketFeed = {
  token: string | null;
  onMessage: (message: Message) => void;
  onConversation: (conversation: Conversation) => void;
  onRejected: () => void;
};

export function useChatSocket({ token, onMessage, onConversation, onRejected }: SocketFeed) {
  const [connection, setConnection] = useState<ConnectionState>("connecting");
  const [attempt, setAttempt] = useState(0);
  const socketRef = useRef<ChatSocket | null>(null);

  useEffect(() => {
    if (!token) return;

    const socket = connectSocket(token, {
      onConnected: () => {
        setAttempt(0);
        setConnection("online");
      },
      onReconnecting: (next) => {
        setAttempt(next);
        setConnection("reconnecting");
      },
      onGaveUp: () => setConnection("offline"),
      onRejected,
      onConversation,
      onMessage,
    });

    socketRef.current = socket;
    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [token, onMessage, onConversation, onRejected]);

  const send = useCallback(async (conversationId: Id, text: string) => {
    if (!socketRef.current) throw new Error("Not connected yet.");
    await socketRef.current.send(conversationId, text);
  }, []);

  return { connection, attempt, send };
}
