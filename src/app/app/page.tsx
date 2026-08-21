"use client";

import { ChatProvider } from "@/hooks/useChat";
import { useSession } from "@/hooks/useSession";
import { LoginCard } from "@/components/auth/LoginCard";
import { ChatShell } from "@/components/chat/ChatShell";
import { Spinner } from "@/components/ui/Button";

export default function AppPage() {
  const { session, restoring } = useSession();

  if (restoring) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg text-muted">
        <Spinner size={20} />
      </div>
    );
  }

  if (!session) return <LoginCard />;

  return (
    <ChatProvider>
      <ChatShell />
    </ChatProvider>
  );
}
