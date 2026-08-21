"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useSession } from "@/hooks/useSession";
import { Button } from "@/components/ui/Button";
import type { GroupConversation } from "@/lib/types";

export function RenameGroupForm({
  conversation,
  onDone,
}: {
  conversation: GroupConversation;
  onDone: (group: GroupConversation) => void;
}) {
  const { session } = useSession();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(conversation.name);
  const [busy, setBusy] = useState(false);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!session || !name.trim()) return;
    setBusy(true);
    try {
      onDone(await api.renameGroup(session.token, conversation._id, name.trim()));
      setEditing(false);
    } finally {
      setBusy(false);
    }
  }

  if (!editing) {
    return (
      <div className="px-5 pt-4">
        <Button variant="secondary" onClick={() => setEditing(true)} className="w-full">
          Rename group
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={save} className="flex gap-2 px-5 pt-4">
      <input
        value={name}
        autoFocus
        maxLength={64}
        onChange={(event) => setName(event.target.value)}
        aria-label="Group name"
        className="h-11 min-w-0 flex-1 border border-line bg-surface-2 px-3.5 text-[14px] text-ink hover:border-line-strong"
      />
      <Button type="submit" busy={busy} disabled={!name.trim()}>
        Save
      </Button>
    </form>
  );
}
