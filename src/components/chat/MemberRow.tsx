"use client";

import { Avatar } from "@/components/ui/Avatar";
import type { PublicUser } from "@/lib/types";

type MemberRowProps = {
  member: PublicUser;
  isMe: boolean;
  isAdmin: boolean;
  canManage: boolean;
  busy: boolean;
  onPromote: () => void;
  onRemove: () => void;
};

export function MemberRow({
  member,
  isMe,
  isAdmin,
  canManage,
  busy,
  onPromote,
  onRemove,
}: MemberRowProps) {
  return (
    <li className="flex items-center gap-3 px-5 py-2">
      <Avatar id={member._id} name={member.name} size={44} />

      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 truncate text-[14.5px] font-medium text-ink">
          <span className="truncate">{member.name}</span>
          {isMe && <span className="shrink-0 text-muted">(you)</span>}
          {isAdmin && (
            <span className="text-meta shrink-0 bg-accent-soft px-1.5 py-0.5 text-accent">
              Admin
            </span>
          )}
        </p>
        <p className="text-meta truncate text-muted">{member.phone}</p>
      </div>

      {canManage && !isMe && (
        <div className="flex shrink-0 gap-1">
          {!isAdmin && (
            <button
              type="button"
              disabled={busy}
              onClick={onPromote}
              className="px-2 py-1 text-[12.5px] text-muted hover:bg-surface-2 hover:text-ink disabled:opacity-50"
            >
              Promote
            </button>
          )}
          <button
            type="button"
            disabled={busy}
            onClick={onRemove}
            className="px-2 py-1 text-[12.5px] text-danger hover:bg-danger-soft disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      )}
    </li>
  );
}
