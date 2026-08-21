"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useChat } from "@/hooks/useChat";
import { useSession } from "@/hooks/useSession";
import { useUserSearch } from "@/hooks/useUserSearch";
import { Modal } from "@/components/ui/Modal";
import { Button, Spinner } from "@/components/ui/Button";
import type { GroupConversation, PublicUser } from "@/lib/types";
import { PersonRow } from "./PersonRow";
import { SearchField } from "./SearchField";
import { SelectedChips } from "./SelectedChips";

export function AddMembersDialog({
  conversation,
  onClose,
}: {
  conversation: GroupConversation;
  onClose: () => void;
}) {
  const { session } = useSession();
  const { upsert } = useChat();
  const [term, setTerm] = useState("");
  const [picked, setPicked] = useState<PublicUser[]>([]);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const { results, searching, tooShort } = useUserSearch(term);

  const existing = new Set(conversation.participants.map((p) => p._id));
  const candidates = results.filter((person) => !existing.has(person._id));

  function toggle(person: PublicUser) {
    setPicked((current) =>
      current.some((p) => p._id === person._id)
        ? current.filter((p) => p._id !== person._id)
        : [...current, person],
    );
  }

  async function add() {
    if (!session || picked.length === 0) return;
    setBusy(true);
    setFailure(null);
    try {
      upsert(
        await api.addMembers(
          session.token,
          conversation._id,
          picked.map((p) => p._id),
        ),
      );
      onClose();
    } catch (cause) {
      setFailure(cause instanceof Error ? cause.message : "Could not add them.");
      setBusy(false);
    }
  }

  return (
    <Modal
      title="Add members"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={add} disabled={picked.length === 0} busy={busy} busyLabel="Adding">
            Add {picked.length > 0 && picked.length}
          </Button>
        </>
      }
    >
      <SelectedChips people={picked} onRemove={toggle} />

      {failure && (
        <p role="alert" className="mx-5 mt-3 bg-danger-soft px-3 py-2 text-[13px] text-danger">
          {failure}
        </p>
      )}

      <SearchField value={term} onChange={setTerm} placeholder="Search people to add" />

      <div className="pb-2">
        {tooShort && (
          <p className="px-5 py-6 text-center text-[13.5px] text-muted">
            Search by name or phone number.
          </p>
        )}
        {!tooShort && searching && (
          <p className="flex items-center justify-center gap-2 py-6 text-[13.5px] text-muted">
            <Spinner size={13} />
            Searching
          </p>
        )}
        {!tooShort && !searching && candidates.length === 0 && (
          <p className="px-5 py-6 text-center text-[13.5px] text-muted">
            Nobody new matches that. Everyone found is already in the group.
          </p>
        )}
        {candidates.map((person) => (
          <PersonRow
            key={person._id}
            person={person}
            selected={picked.some((p) => p._id === person._id)}
            onSelect={() => toggle(person)}
          />
        ))}
      </div>
    </Modal>
  );
}
