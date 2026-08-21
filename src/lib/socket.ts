import { io, type Socket } from "socket.io-client";
import { ORIGIN } from "./http";
import { normalizeIncoming } from "./api";
import type { Conversation, Id, Message } from "./types";

export const MAX_RECONNECT_ATTEMPTS = 5;

export type SocketHandlers = {
  onMessage: (message: Message) => void;
  onConversation: (conversation: Conversation) => void;
  onConnected: () => void;
  onReconnecting: (attempt: number) => void;
  onGaveUp: () => void;
  onRejected: () => void;
};

export type ChatSocket = {
  send: (conversationId: Id, text: string) => Promise<void>;
  close: () => void;
};

export function connectSocket(token: string, handlers: SocketHandlers): ChatSocket {
  const socket: Socket = io(ORIGIN, {
    auth: { token },
    reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
    reconnectionDelay: 800,
    reconnectionDelayMax: 6000,
  });

  socket.on("connect", handlers.onConnected);
  socket.on("message:new", (raw: unknown) => handlers.onMessage(normalizeIncoming(raw)));
  socket.on("conversation:updated", (raw: Conversation) => handlers.onConversation(raw));
  socket.io.on("reconnect_attempt", handlers.onReconnecting);
  socket.io.on("reconnect_failed", handlers.onGaveUp);

  socket.on("connect_error", (error: Error) => {
    const rejected = /token/i.test(error.message);
    if (rejected) {
      socket.close();
      handlers.onRejected();
    }
  });

  return {
    send(conversationId, text) {
      return new Promise((resolve, reject) => {
        if (!socket.connected) {
          reject(new Error("You are offline. This will send when you are back."));
          return;
        }
        const timer = setTimeout(() => reject(new Error("The server did not respond.")), 10000);
        socket.emit(
          "message:send",
          { conversationId, text },
          (ack: { ok?: boolean; error?: string } | undefined) => {
            clearTimeout(timer);
            if (ack?.ok) resolve();
            else reject(new Error(ack?.error ?? "The message was not accepted."));
          },
        );
      });
    },
    close() {
      socket.removeAllListeners();
      socket.close();
    },
  };
}
