import type { Conversation, Id, Message } from "./types";

export function stillAMember(conversation: Conversation, userId: Id | null): boolean {
  if (conversation.type !== "group" || !userId) return true;
  return conversation.participants.some((person) => person._id === userId);
}

export function mergeConversation(list: Conversation[], incoming: Conversation): Conversation[] {
  const existing = list.find((item) => item._id === incoming._id);
  const rest = list.filter((item) => item._id !== incoming._id);
  return [{ ...existing, ...incoming } as Conversation, ...rest];
}

export function applyLastMessage(list: Conversation[], message: Message): Conversation[] {
  return list.map((item) =>
    item._id === message.conversation
      ? {
          ...item,
          updatedAt: message.createdAt,
          lastMessage: {
            text: message.text,
            sender: message.sender,
            createdAt: message.createdAt,
          },
        }
      : item,
  );
}

export function bumpUnread(counts: Record<Id, number>, conversationId: Id): Record<Id, number> {
  return { ...counts, [conversationId]: (counts[conversationId] ?? 0) + 1 };
}
