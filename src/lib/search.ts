const BD_MOBILE = /^01[3-9]\d{8}$/;

export function escapeSearchTerm(term: string): string {
  return term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function searchVariants(term: string): string[] {
  const trimmed = term.trim();
  if (!trimmed) return [];

  const local = trimmed.replace(/[\s-]/g, "").replace(/^(?:\+?880)/, "0");
  if (BD_MOBILE.test(local)) return [local];

  return [
    ...new Set([
      trimmed,
      trimmed.replace(/\S+/g, (word) => word[0].toUpperCase() + word.slice(1).toLowerCase()),
      trimmed.toLowerCase(),
    ]),
  ];
}
