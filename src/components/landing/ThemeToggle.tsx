"use client";

import { useTheme } from "@/hooks/useTheme";
import { MoonIcon, SunIcon } from "@/components/ui/icons";

export function ThemeToggle() {
  const { dark, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="flex size-9 items-center justify-center border border-line text-muted transition-colors hover:border-line-strong hover:text-ink"
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
