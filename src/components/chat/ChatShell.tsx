"use client";

import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { Sidebar } from "./Sidebar";
import { ChatPanel } from "./ChatPanel";
import { EmptyPanel } from "./EmptyPanel";
import { NewChatDialog } from "./NewChatDialog";
import { NewGroupDialog } from "./NewGroupDialog";

export function ChatShell() {
  const { activeId, conversations, open } = useChat();
  const [dialog, setDialog] = useState<"chat" | "group" | null>(null);

  const active = conversations.find((c) => c._id === activeId) ?? null;

  return (
    <div className="flex h-dvh bg-bg">
      <div
        className={`w-full shrink-0 border-r border-line md:w-[340px] ${
          activeId ? "hidden md:block" : "block"
        }`}
      >
        <Sidebar onNewChat={() => setDialog("chat")} onNewGroup={() => setDialog("group")} />
      </div>

      <div className={`min-w-0 flex-1 ${activeId ? "block" : "hidden md:block"}`}>
        {active ? (
          <ChatPanel key={active._id} conversation={active} onBack={() => open(null)} />
        ) : (
          <EmptyPanel />
        )}
      </div>

      {dialog === "chat" && <NewChatDialog onClose={() => setDialog(null)} />}
      {dialog === "group" && <NewGroupDialog onClose={() => setDialog(null)} />}
    </div>
  );
}
