"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_RECONNECT_ATTEMPTS } from "@/lib/socket";
import { Spinner } from "@/components/ui/Button";
import type { ConnectionState } from "@/lib/types";

const RESTORED_MS = 2000;

export function ConnectionBanner({ state, attempt }: { state: ConnectionState; attempt: number }) {
  const [showRestored, setShowRestored] = useState(false);
  const wasDown = useRef(false);

  useEffect(() => {
    if (state === "reconnecting" || state === "offline") {
      wasDown.current = true;
      return;
    }
    if (state !== "online" || !wasDown.current) return;

    wasDown.current = false;
    const show = setTimeout(() => setShowRestored(true), 0);
    const hide = setTimeout(() => setShowRestored(false), RESTORED_MS);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [state]);

  if (state === "reconnecting") {
    return (
      <Slot tone="warn">
        <Spinner size={11} />
        Reconnecting, attempt {attempt || 1} of {MAX_RECONNECT_ATTEMPTS}. Messages you send will be
        queued.
      </Slot>
    );
  }

  if (state === "offline") {
    return (
      <Slot tone="danger">
        <span aria-hidden className="size-2 bg-current" />
        Offline. Reconnecting when the network is back. Nothing you type will be lost.
      </Slot>
    );
  }

  if (showRestored) {
    return (
      <Slot tone="accent">
        <span aria-hidden className="size-2 bg-current" />
        Back online
      </Slot>
    );
  }

  return null;
}

function Slot({
  tone,
  children,
}: {
  tone: "warn" | "danger" | "accent";
  children: React.ReactNode;
}) {
  const palette = {
    warn: "bg-warn-soft text-warn",
    danger: "bg-danger-soft text-danger",
    accent: "bg-accent-soft text-accent",
  }[tone];

  return (
    <div
      role="status"
      className={`flex h-7.5 shrink-0 items-center justify-center gap-2 px-4 text-[12.5px] ${palette}`}
    >
      {children}
    </div>
  );
}
