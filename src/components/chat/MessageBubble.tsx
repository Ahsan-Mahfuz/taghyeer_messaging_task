"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Spinner } from "@/components/ui/Button";
import { formatClock } from "@/lib/time";
import type { Message, PublicUser } from "@/lib/types";
import { CheckIcon } from "@/components/ui/icons";

type MessageBubbleProps = {
  message: Message;
  mine: boolean;
  startsRun: boolean;
  showSender: boolean;
  sender?: PublicUser;
  onRetry: (localId: string) => void;
};

export function MessageBubble({
  message,
  mine,
  startsRun,
  showSender,
  sender,
  onRetry,
}: MessageBubbleProps) {
  const blank = message.text.trim().length === 0;
  const failed = message.state === "failed";

  return (
    <div
      className={`flex gap-2 ${mine ? "justify-end" : "justify-start"}`}
      style={{ marginTop: startsRun ? 14 : 3 }}
    >
      {!mine && (
        <span className="w-6 shrink-0">
          {showSender && sender && <Avatar id={sender._id} name={sender.name} size={24} />}
        </span>
      )}

      <div
        className={`flex min-w-0 max-w-[290px] flex-col md:max-w-[600px] ${mine ? "items-end" : ""}`}
      >
        {showSender && sender && (
          <span className="mb-1 truncate text-[13px] font-medium text-muted">{sender.name}</span>
        )}

        <div
          className={` px-3 py-2 ${
            mine ? "bg-accent text-accent-ink" : "border border-line bg-surface text-ink"
          } ${failed ? "border border-danger" : ""}`}
          style={{ opacity: message.state === "sending" ? 0.72 : 1 }}
        >
          <p
            className={`text-body break-anywhere whitespace-pre-wrap ${
              blank ? "italic opacity-60" : ""
            }`}
          >
            {blank ? "Empty message" : message.text}
          </p>

          <span className="mt-1 flex items-center justify-end gap-1">
            <span className={`text-meta ${mine ? "opacity-70" : "text-faint"}`}>
              {formatClock(message.createdAt)}
            </span>
            {mine && message.state === "sending" && <Spinner size={10} />}
            {mine && message.state === "sent" && (
              <span aria-label="Sent" className="animate-pop opacity-70">
                <CheckIcon />
              </span>
            )}
          </span>
        </div>

        {failed && (
          <span className="mt-1 flex items-center gap-2 text-[12px] text-danger">
            Not sent
            <button
              type="button"
              onClick={() => message.localId && onRetry(message.localId)}
              className="font-medium underline underline-offset-2 hover:no-underline"
            >
              Retry
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
