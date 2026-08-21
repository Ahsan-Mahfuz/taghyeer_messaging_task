"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useChat } from "@/hooks/useChat";
import { useSession } from "@/hooks/useSession";
import { useUserSearch } from "@/hooks/useUserSearch";
import { Modal } from "@/components/ui/Modal";
import { Button, Spinner } from "@/components/ui/Button";
import type { PublicUser } from "@/lib/types";
import { PersonRow } from "./PersonRow";
import { SearchField } from "./SearchField";
import { SelectedChips } from "./SelectedChips";

const MAX_MEMBERS = 64;
const NAME_LIMIT = 64;

export function NewGroupDialog({ onClose }: { onClose: () => void }) {
  const { session } = useSession();
  const { open, reload, upsert } = useChat();
  const [name, setName] = useState("");
  const [term, setTerm] = useState("");
  const [picked, setPicked] = useState<PublicUser[]>([]);
  const [creating, setCreating] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const { results, searching, tooShort } = useUserSearch(term);

  const total = picked.length + 1;
  const shortBy = Math.max(0, 3 - total);
  const ready = name.trim().length > 0 && shortBy === 0 && total <= MAX_MEMBERS;

  function toggle(person: PublicUser) {
    setPicked((current) =>
      current.some((p) => p._id === person._id)
        ? current.filter((p) => p._id !== person._id)
        : current.length + 1 < MAX_MEMBERS
          ? [...current, person]
          : current,
    );
  }

  async function create() {
    if (!session || !ready) return;
    setCreating(true);
    setFailure(null);
    try {
      const group = await api.createGroup(
        session.token,
        name.trim(),
        picked.map((p) => p._id),
      );
      upsert(group);
      await reload();
      open(group._id);
      onClose();
    } catch (cause) {
      setFailure(cause instanceof Error ? cause.message : "Could not create the group.");
      setCreating(false);
    }
  }

  return (
    <Modal
      title="New group"
      onClose={onClose}
      footer={
        <>
          <span className="text-meta mr-auto text-muted">
            {total} of {MAX_MEMBERS} members
          </span>
          <Button variant="secondary" onClick={onClose} disabled={creating}>
            Cancel
          </Button>
          <Button onClick={create} disabled={!ready} busy={creating} busyLabel="Creating">
            Create group
          </Button>
        </>
      }
    >
      <div className="px-5 pt-4">
        <label htmlFor="group-name" className="text-[13px] font-medium text-ink">
          Group name
        </label>
        <input
          id="group-name"
          value={name}
          maxLength={NAME_LIMIT}
          onChange={(event) => setName(event.target.value)}
          className="mt-1.5 h-12 w-full border border-line bg-surface-2 px-3.5 text-[14.5px] text-ink placeholder:text-faint hover:border-line-strong"
          placeholder="Weekend plans"
        />
        <div className="mt-1.5 flex items-baseline justify-between">
          <p className="text-[12px] text-muted">Everyone in the group can see this name.</p>
          <span className="text-meta text-faint">
            {name.length}/{NAME_LIMIT}
          </span>
        </div>
      </div>

      <SelectedChips people={picked} onRemove={toggle} />

      {shortBy > 0 && (
        <p className="mx-5 mt-1 bg-warn-soft px-3 py-2 text-[12.5px] text-warn">
          A group needs at least 3 people including you. Add {shortBy} more.
        </p>
      )}

      {failure && (
        <p role="alert" className="mx-5 mt-3 bg-danger-soft px-3 py-2 text-[13px] text-danger">
          {failure}
        </p>
      )}

      <SearchField value={term} onChange={setTerm} placeholder="Search people to add" />

      <div className="pb-2">
        {tooShort && (
          <p className="px-5 py-6 text-center text-[13.5px] text-muted">
            Search by name or phone number to add people.
          </p>
        )}
        {!tooShort && searching && (
          <p className="flex items-center justify-center gap-2 py-6 text-[13.5px] text-muted">
            <Spinner size={13} />
            Searching
          </p>
        )}
        {!tooShort &&
          !searching &&
          results.map((person) => (
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
