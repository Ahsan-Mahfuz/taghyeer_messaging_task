import type { Message } from "./types";

export function mergeMessages(existing: Message[], incoming: Message[]): Message[] {
  const byId = new Map<string, Message>();
  for (const message of [...existing, ...incoming]) {
    const previous = byId.get(message._id);
    byId.set(message._id, previous ? { ...previous, ...message } : message);
  }
  return [...byId.values()].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

export function makeLocalId(): string {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
