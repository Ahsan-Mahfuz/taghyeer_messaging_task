"use client";

export function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="px-5 pt-4 pb-3">
      <input
        type="search"
        value={value}
        autoFocus
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full border border-line bg-surface-2 px-3.5 text-[14.5px] text-ink placeholder:text-faint hover:border-line-strong"
      />
    </div>
  );
}
