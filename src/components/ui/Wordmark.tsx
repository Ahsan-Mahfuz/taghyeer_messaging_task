export function Wordmark({ size = 18 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden className="bg-accent" style={{ width: size * 0.44, height: size * 0.44 }} />
      <span className="font-display font-bold tracking-tight text-ink" style={{ fontSize: size }}>
        Pulse
      </span>
    </span>
  );
}
