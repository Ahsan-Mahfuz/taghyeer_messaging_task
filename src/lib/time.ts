const RUN_GAP_MS = 15 * 60 * 1000;

const clock = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" });
const dayLabel = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
});
const shortDate = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit" });

export function formatClock(iso: string): string {
  return clock.format(new Date(iso));
}

export function formatShortDate(iso: string): string {
  return shortDate.format(new Date(iso));
}

export function formatDay(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";
  return dayLabel.format(date);
}

export function formatListStamp(iso?: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  return isSameDay(date, new Date()) ? formatClock(iso) : formatShortDate(iso);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

export function startsNewDay(current: string, previous?: string): boolean {
  if (!previous) return true;
  return !isSameDay(new Date(current), new Date(previous));
}

export function startsNewRun(
  current: { sender: string; createdAt: string },
  previous?: { sender: string; createdAt: string },
): boolean {
  if (!previous) return true;
  if (previous.sender !== current.sender) return true;
  if (startsNewDay(current.createdAt, previous.createdAt)) return true;
  const gap = new Date(current.createdAt).getTime() - new Date(previous.createdAt).getTime();
  return gap > RUN_GAP_MS;
}
