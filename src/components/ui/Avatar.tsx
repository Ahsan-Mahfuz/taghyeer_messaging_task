import { avatarColor, initials } from "@/lib/avatar";

type AvatarProps = {
  id: string;
  name: string;
  size?: 24 | 28 | 36 | 44 | 64;
};

const FONT_SIZE: Record<number, number> = {
  24: 10,
  28: 11,
  36: 13,
  44: 15,
  64: 22,
};

export function Avatar({ id, name, size = 36 }: AvatarProps) {
  const label = initials(name);
  const blank = label === "?";

  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center font-semibold select-none"
      style={{
        width: size,
        height: size,
        fontSize: FONT_SIZE[size] + (blank ? 2 : 0),
        background: blank ? "transparent" : avatarColor(id),
        color: blank ? "var(--text-faint)" : "#ffffff",
        border: blank ? "1px dashed var(--border-strong)" : undefined,
      }}
    >
      {label}
    </span>
  );
}
