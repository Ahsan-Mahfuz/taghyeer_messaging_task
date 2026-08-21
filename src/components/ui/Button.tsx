import type { ButtonHTMLAttributes, Ref } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  busy?: boolean;
  busyLabel?: string;
  ref?: Ref<HTMLButtonElement>;
};

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-ink shadow-e1 hover:bg-accent-hover disabled:bg-surface-2 disabled:text-faint disabled:shadow-none",
  secondary: "bg-surface text-ink border border-line hover:border-line-strong disabled:text-faint",
  ghost: "text-muted hover:bg-surface-2 hover:text-ink disabled:text-faint",
  danger: "bg-danger-soft text-danger hover:brightness-95 disabled:text-faint",
};

export function Button({
  variant = "primary",
  busy = false,
  busyLabel,
  disabled,
  children,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || busy}
      className={`inline-flex h-10 items-center justify-center gap-2 px-4 text-[13px] font-medium transition-colors disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
    >
      {busy && <Spinner />}
      {busy && busyLabel ? busyLabel : children}
    </button>
  );
}

export function Spinner({ size = 14 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-block animate-spin rounded-full border-2 border-current border-t-transparent"
      style={{ width: size, height: size, opacity: 0.7 }}
    />
  );
}
