import { ApiError, OBJECT_ID, request } from "./http";
import { escapeSearchTerm, searchVariants } from "./search";
import type {
  Conversation,
  GroupConversation,
  Id,
  Message,
  MessagePage,
  PublicUser,
  Session,
  User,
} from "./types";

export { ORIGIN, ApiError } from "./http";

function toMessage(raw: Record<string, unknown>): Message {
  const createdAt = raw.createdAt;
  return {
    _id: String(raw._id ?? raw.id),
    conversation: String(raw.conversation),
    sender: String(raw.sender),
    text: String(raw.text ?? ""),
    createdAt:
      typeof createdAt === "number"
        ? new Date(createdAt).toISOString()
        : String(createdAt ?? new Date().toISOString()),
    state: "sent",
  };
}

export function normalizeIncoming(raw: unknown): Message {
  return toMessage(raw as Record<string, unknown>);
}

export const api = {
  login(phone: string, name: string): Promise<Session> {
    return request<Session>("/auth/login", null, {
      method: "POST",
      body: JSON.stringify({ phone, name }),
    });
  },

  me(token: string): Promise<User> {
    return request<User>("/auth/me", token);
  },

  async searchUsers(token: string, term: string): Promise<PublicUser[]> {
    const pages = await Promise.all(
      searchVariants(term).map((variant) =>
        request<PublicUser[]>(
          `/users/search?q=${encodeURIComponent(escapeSearchTerm(variant))}`,
          token,
        ).catch(() => [] as PublicUser[]),
      ),
    );

    const byId = new Map<string, PublicUser>();
    for (const page of pages) {
      if (!Array.isArray(page)) continue;
      for (const person of page) byId.set(person._id, person);
    }
    return [...byId.values()];
  },

  async conversations(token: string): Promise<Conversation[]> {
    const body = await request<{ data?: Conversation[] }>("/conversations", token);
    return body?.data ?? [];
  },

  async startDirect(token: string, userId: Id): Promise<Id> {
    if (!OBJECT_ID.test(userId)) throw new ApiError(400, "BAD_ID", "That user id is not valid.");
    const created = await request<{ _id: Id }>("/conversations", token, {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
    return created._id;
  },

  async messages(
    token: string,
    conversationId: Id,
    options: { limit?: number; before?: Id } = {},
  ): Promise<MessagePage> {
    const params = new URLSearchParams({ limit: String(options.limit ?? 30) });
    if (options.before && OBJECT_ID.test(options.before)) params.set("before", options.before);

    const body = await request<{ messages?: unknown[]; hasMore?: boolean }>(
      `/conversations/${conversationId}/messages?${params}`,
      token,
    );
    const messages = (body?.messages ?? []).map((raw) => toMessage(raw as Record<string, unknown>));
    messages.reverse();
    return { messages, hasMore: Boolean(body?.hasMore) };
  },

  async send(token: string, conversationId: Id, text: string): Promise<Message> {
    const created = await request<Record<string, unknown>>("/messages", token, {
      method: "POST",
      body: JSON.stringify({ conversationId, text }),
    });
    return toMessage(created);
  },

  createGroup(token: string, name: string, participantIds: Id[]): Promise<GroupConversation> {
    return request<GroupConversation>("/conversations/group", token, {
      method: "POST",
      body: JSON.stringify({ name, participantIds }),
    });
  },

  addMembers(token: string, groupId: Id, userIds: Id[]): Promise<GroupConversation> {
    return request<GroupConversation>(`/conversations/${groupId}/participants`, token, {
      method: "POST",
      body: JSON.stringify({ userIds }),
    });
  },

  removeMember(token: string, groupId: Id, userId: Id): Promise<GroupConversation> {
    return request<GroupConversation>(`/conversations/${groupId}/participants/${userId}`, token, {
      method: "DELETE",
    });
  },

  promoteToAdmin(token: string, groupId: Id, userId: Id): Promise<GroupConversation> {
    return request<GroupConversation>(`/conversations/${groupId}/admins`, token, {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
  },

  renameGroup(token: string, groupId: Id, name: string): Promise<GroupConversation> {
    return request<GroupConversation>(`/conversations/${groupId}`, token, {
      method: "PATCH",
      body: JSON.stringify({ name }),
    });
  },
};
