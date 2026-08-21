"use client";

import { useEffect, useRef } from "react";
import { Button } from "./Button";

type ConfirmDialogProps = {
  title: string;
  body: string;
  confirmLabel: string;
  tone?: "primary" | "danger";
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  title,
  body,
  confirmLabel,
  tone = "primary",
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    confirmRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !busy) onCancel();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel, busy]);

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/45 p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onCancel();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-95 bg-surface p-6 shadow-e3"
      >
        <h2 className="font-display text-[18px] font-semibold text-ink">{title}</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">{body}</p>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button
            ref={confirmRef}
            variant={tone === "danger" ? "danger" : "primary"}
            onClick={onConfirm}
            busy={busy}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
