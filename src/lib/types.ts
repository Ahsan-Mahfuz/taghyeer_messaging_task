export type Id = string;

export type PublicUser = {
  _id: Id;
  name: string;
  phone: string;
};

export type User = PublicUser & {
  createdAt?: string;
};

export type DeliveryState = "sending" | "sent" | "failed";

export type Message = {
  _id: Id;
  conversation: Id;
  sender: Id;
  text: string;
  createdAt: string;
  state?: DeliveryState;
  localId?: string;
};

export type LastMessage = {
  text?: string;
  sender?: Id;
  createdAt?: string;
};

export type DirectConversation = {
  _id: Id;
  type: "direct";
  lastMessage: LastMessage;
  updatedAt: string;
  participant: PublicUser;
};

export type GroupConversation = {
  _id: Id;
  type: "group";
  lastMessage: LastMessage;
  updatedAt: string;
  name: string;
  createdBy: Id;
  admins: Id[];
  participants: PublicUser[];
  createdAt?: string;
};

export type Conversation = DirectConversation | GroupConversation;

export type MessagePage = {
  messages: Message[];
  hasMore: boolean;
};

export type Session = {
  token: string;
  user: User;
};

export type ConnectionState = "connecting" | "online" | "reconnecting" | "offline";

export function isGroup(conversation: Conversation): conversation is GroupConversation {
  return conversation.type === "group";
}

export function conversationTitle(conversation: Conversation): string {
  return isGroup(conversation) ? conversation.name : conversation.participant.name;
}

export function conversationMembers(conversation: Conversation): PublicUser[] {
  return isGroup(conversation) ? conversation.participants : [conversation.participant];
}

export type ChatState = {
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
  connection: ConnectionState;
  attempt: number;
  unread: Record<Id, number>;
  activeId: Id | null;
  open: (id: Id | null) => void;
  reload: () => void;
  upsert: (conversation: Conversation) => void;
  sendOverSocket: (conversationId: Id, text: string) => Promise<void>;
  onIncoming: (listener: (message: Message) => void) => () => void;
};
