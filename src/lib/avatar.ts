const PALETTE = [
  "#5b3df5",
  "#b03a6e",
  "#0f7a6c",
  "#b4622a",
  "#3b5bc4",
  "#7a2fa8",
  "#1c6e8c",
  "#8a6a12",
  "#a33a2e",
  "#3e6b22",
];

function hash(id: string): number {
  let value = 0;
  for (let i = 0; i < id.length; i += 1) {
    value = (value * 31 + id.charCodeAt(i)) >>> 0;
  }
  return value;
}

export function avatarColor(id: string): string {
  return PALETTE[hash(id) % PALETTE.length];
}

export function initials(name: string): string {
  const parts = String(name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
