"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "pulse-theme";
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function isDark() {
  return document.documentElement.classList.contains("dark");
}

export function useTheme() {
  const dark = useSyncExternalStore(subscribe, isDark, () => false);

  const toggle = useCallback(() => {
    const next = !isDark();
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {}
    listeners.forEach((listener) => listener());
  }, []);

  return { dark, toggle };
}
