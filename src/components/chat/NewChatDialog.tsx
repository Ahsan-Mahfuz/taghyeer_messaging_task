"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useChat } from "@/hooks/useChat";
import { useSession } from "@/hooks/useSession";
import { useUserSearch } from "@/hooks/useUserSearch";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Button";
import { PersonRow } from "./PersonRow";
import { SearchField } from "./SearchField";

export function NewChatDialog({ onClose }: { onClose: () => void }) {
  const { session } = useSession();
  const { open, reload } = useChat();
  const [term, setTerm] = useState("");
  const [starting, setStarting] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const { results, searching, error, tooShort } = useUserSearch(term);

  async function start(userId: string) {
    if (!session) return;
    setStarting(userId);
    setFailure(null);
    try {
      const conversationId = await api.startDirect(session.token, userId);
      await reload();
      open(conversationId);
      onClose();
    } catch (cause) {
      setFailure(cause instanceof Error ? cause.message : "Could not start that conversation.");
      setStarting(null);
    }
  }

  return (
    <Modal title="New chat" onClose={onClose}>
      <SearchField
        value={term}
        onChange={setTerm}
        placeholder="Full phone number, or the start of a name"
      />

      {failure && (
        <p role="alert" className="mx-5 bg-danger-soft px-3 py-2 text-[13px] text-danger">
          {failure}
        </p>
      )}

      <div className="pb-2">
        {tooShort && (
          <p className="px-5 py-8 text-center text-[13.5px] text-muted">
            Type at least two characters, or paste a full phone number.
          </p>
        )}

        {!tooShort && searching && (
          <p className="flex items-center justify-center gap-2 py-8 text-[13.5px] text-muted">
            <Spinner size={13} />
            Searching
          </p>
        )}

        {!tooShort && !searching && error && (
          <p className="px-5 py-8 text-center text-[13.5px] text-danger">{error}</p>
        )}

        {!tooShort && !searching && !error && results.length === 0 && (
          <div className="px-5 py-8 text-center">
            <p className="text-[14.5px] font-medium text-ink">
              No one found for &ldquo;{term.trim()}&rdquo;
            </p>
            <p className="mt-1 text-[13px] text-muted">
              Names match from the first letter, and a phone number has to be complete. Try their
              whole number.
            </p>
          </div>
        )}

        {results.map((person) => (
          <PersonRow
            key={person._id}
            person={person}
            onSelect={() => start(person._id)}
            trailing={starting === person._id ? <Spinner size={14} /> : undefined}
          />
        ))}
      </div>
    </Modal>
  );
}
