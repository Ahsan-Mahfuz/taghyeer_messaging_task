import type { Session } from "./types";

const KEY = "pulse-session";

export function readSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    return parsed?.token && parsed?.user?._id ? parsed : null;
  } catch {
    return null;
  }
}

export function writeSession(session: Session): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(session));
  } catch {}
}

export function clearSession(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {}
}

export const PHONE_PATTERN = /^(?:\+?880|0)1[3-9]\d{8}$/;

export function isValidPhone(value: string): boolean {
  return PHONE_PATTERN.test(value.trim().replace(/[\s-]/g, ""));
}

export function toLocalPhone(value: string): string {
  const compact = value.trim().replace(/[\s-]/g, "");
  return compact.replace(/^(?:\+?880)/, "0");
}
