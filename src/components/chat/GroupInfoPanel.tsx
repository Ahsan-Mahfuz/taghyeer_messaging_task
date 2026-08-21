"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useChat } from "@/hooks/useChat";
import { useSession } from "@/hooks/useSession";
import { formatShortDate } from "@/lib/time";
import type { GroupConversation, PublicUser } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { AddMembersDialog } from "./AddMembersDialog";
import { GROUP_PROMPTS } from "./groupPrompts";
import { MemberRow } from "./MemberRow";
import { RenameGroupForm } from "./RenameGroupForm";
import { CloseIcon } from "@/components/ui/icons";

type Pending =
  | { kind: "promote"; member: PublicUser }
  | { kind: "remove"; member: PublicUser }
  | { kind: "leave" };

export function GroupInfoPanel({
  conversation,
  onClose,
}: {
  conversation: GroupConversation;
  onClose: () => void;
}) {
  const { session } = useSession();
  const { upsert, open, reload } = useChat();
  const [pending, setPending] = useState<Pending | null>(null);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const myId = session?.user._id;
  const iAmAdmin = Boolean(myId && conversation.admins.includes(myId));

  async function confirmPending() {
    if (!session || !pending) return;
    setBusy(true);
    setFailure(null);
    try {
      if (pending.kind === "promote") {
        upsert(await api.promoteToAdmin(session.token, conversation._id, pending.member._id));
      } else if (pending.kind === "remove") {
        upsert(await api.removeMember(session.token, conversation._id, pending.member._id));
      } else {
        await api.removeMember(session.token, conversation._id, myId!);
        open(null);
        await reload();
      }
      setPending(null);
    } catch (cause) {
      setFailure(cause instanceof Error ? cause.message : "That did not work.");
      setPending(null);
    } finally {
      setBusy(false);
    }
  }

  const copy =
    pending && GROUP_PROMPTS[pending.kind](pending.kind === "leave" ? "" : pending.member.name);

  return (
    <aside className="flex w-full shrink-0 flex-col border-l border-line bg-surface md:w-90">
      <header className="flex shrink-0 items-start justify-between gap-2 border-b border-line px-5 py-4">
        <div className="min-w-0">
          <h2 className="font-display text-[17px] leading-snug font-semibold break-words text-ink">
            {conversation.name}
          </h2>
          <p className="text-meta mt-1 text-muted">
            {conversation.participants.length} members
            {conversation.createdAt && `, created ${formatShortDate(conversation.createdAt)}`}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close group info"
          className="-mr-2 flex size-9 shrink-0 items-center justify-center text-muted hover:bg-surface-2 hover:text-ink"
        >
          <CloseIcon />
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {iAmAdmin && <RenameGroupForm conversation={conversation} onDone={upsert} />}

        {failure && (
          <p role="alert" className="mx-5 mt-3 bg-danger-soft px-3 py-2 text-[13px] text-danger">
            {failure}
          </p>
        )}

        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <h3 className="text-[13px] font-medium text-muted">Members</h3>
          {iAmAdmin && (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="text-[13px] font-medium text-accent hover:underline"
            >
              Add
            </button>
          )}
        </div>

        <ul className="pb-3">
          {conversation.participants.map((member) => (
            <MemberRow
              key={member._id}
              member={member}
              isMe={member._id === myId}
              isAdmin={conversation.admins.includes(member._id)}
              canManage={iAmAdmin}
              busy={busy}
              onPromote={() => setPending({ kind: "promote", member })}
              onRemove={() => setPending({ kind: "remove", member })}
            />
          ))}
        </ul>
      </div>

      <footer className="shrink-0 border-t border-line p-4">
        <Button variant="danger" onClick={() => setPending({ kind: "leave" })} className="w-full">
          Leave group
        </Button>
      </footer>

      {adding && <AddMembersDialog conversation={conversation} onClose={() => setAdding(false)} />}

      {pending && copy && (
        <ConfirmDialog
          title={copy.title}
          body={copy.body}
          confirmLabel={copy.confirmLabel}
          tone={pending.kind === "promote" ? "primary" : "danger"}
          busy={busy}
          onConfirm={confirmPending}
          onCancel={() => setPending(null)}
        />
      )}
    </aside>
  );
}
