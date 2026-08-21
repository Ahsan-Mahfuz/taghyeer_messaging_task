import type { InputHTMLAttributes } from "react";
import { useId } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string | null;
  mono?: boolean;
};

export function TextField({
  label,
  hint,
  error,
  mono = false,
  className = "",
  ...rest
}: TextFieldProps) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-medium text-ink">
        {label}
      </label>
      <input
        {...rest}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={`h-12 border bg-surface-2 px-3.5 text-[14.5px] text-ink transition-colors placeholder:text-faint hover:border-line-strong disabled:opacity-60 ${
          error ? "border-danger" : "border-line"
        } ${mono ? "font-mono tabular-nums" : ""} ${className}`}
      />
      {error ? (
        <p id={`${id}-error`} className="text-[12px] text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[12px] text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
