export function EmptyPanel() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-8 text-center">
      <span aria-hidden className="mb-1 size-2.5 bg-accent" />
      <p className="font-display text-[20px] font-semibold text-ink">Pick a conversation</p>
      <p className="max-w-[38ch] text-[14.5px] text-muted">
        Choose someone from the list, or start a new chat with a phone number.
      </p>
    </div>
  );
}
