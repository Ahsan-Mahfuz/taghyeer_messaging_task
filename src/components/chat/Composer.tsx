"use client";

import { useRef, useState } from "react";

const MAX_LENGTH = 4000;
const COUNTER_FROM = 3600;

export function Composer({
  conversationName,
  disabled,
  onSend,
}: {
  conversationName: string;
  disabled: boolean;
  onSend: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const ready = text.trim().length > 0 && !disabled;

  function submit() {
    if (!ready) return;
    onSend(text);
    setText("");
    const field = inputRef.current;
    if (field) field.style.height = "auto";
  }

  function grow(element: HTMLTextAreaElement) {
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, 160)}px`;
  }

  return (
    <div className="border-t border-line bg-surface px-3 py-2.5 md:px-4">
      <div className="flex items-end gap-2">
        <textarea
          ref={inputRef}
          rows={1}
          value={text}
          disabled={disabled}
          maxLength={MAX_LENGTH}
          placeholder={`Message ${conversationName}`}
          aria-label={`Message ${conversationName}`}
          onChange={(event) => {
            setText(event.target.value);
            grow(event.target);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              submit();
            }
          }}
          className="text-body max-h-40 min-h-11 flex-1 resize-none border border-line bg-surface-2 px-3.5 py-2.5 text-ink placeholder:text-faint hover:border-line-strong disabled:opacity-60"
        />
        <button
          type="button"
          onClick={submit}
          disabled={!ready}
          tabIndex={ready ? 0 : -1}
          className="h-11 shrink-0 bg-accent px-4 text-[13px] font-medium text-accent-ink transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-faint disabled:shadow-none"
        >
          Send
        </button>
      </div>
      {text.length >= COUNTER_FROM && (
        <p className="text-meta mt-1 text-right text-muted">
          {text.length} / {MAX_LENGTH}
        </p>
      )}
    </div>
  );
}
