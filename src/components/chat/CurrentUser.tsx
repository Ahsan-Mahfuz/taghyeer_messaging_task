"use client";

import { useState } from "react";
import { useSession } from "@/hooks/useSession";
import { useTheme } from "@/hooks/useTheme";
import { Avatar } from "@/components/ui/Avatar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { MoonIcon, SunIcon } from "@/components/ui/icons";

export function CurrentUser() {
  const { user, signOut } = useSession();
  const { dark, toggle } = useTheme();
  const [confirming, setConfirming] = useState(false);

  if (!user) return null;

  return (
    <footer className="flex items-center gap-3 border-t border-line px-4 py-3">
      <Avatar id={user._id} name={user.name} size={44} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-medium text-ink">{user.name}</p>
        <p className="text-meta truncate text-muted">{user.phone}</p>
      </div>

      <button
        type="button"
        onClick={toggle}
        aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
        className="p-2 text-muted hover:bg-surface hover:text-ink"
      >
        {dark ? <SunIcon /> : <MoonIcon />}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="px-2 py-2 text-[13px] text-muted hover:bg-surface hover:text-ink"
      >
        Log out
      </button>

      {confirming && (
        <ConfirmDialog
          title="Log out of Pulse?"
          body="Your conversations stay where they are. You will need your phone number and name to get back in."
          confirmLabel="Log out"
          onConfirm={signOut}
          onCancel={() => setConfirming(false)}
        />
      )}
    </footer>
  );
}
