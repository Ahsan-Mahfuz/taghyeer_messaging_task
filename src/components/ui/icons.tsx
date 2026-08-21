type IconProps = {
  size?: number;
  className?: string;
};

function Glyph({ size = 16, className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {children}
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M4 4l8 8M12 4l-8 8" />
    </Glyph>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M10 3L5 8l5 5" />
    </Glyph>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Glyph {...props} size={props.size ?? 12}>
      <path d="M3 8.5l3.2 3.2L13 5" />
    </Glyph>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="8" cy="8" r="3" />
      <path d="M8 1v1.6M8 13.4V15M15 8h-1.6M2.6 8H1M12.9 3.1l-1.1 1.1M4.2 11.8l-1.1 1.1M12.9 12.9l-1.1-1.1M4.2 4.2L3.1 3.1" />
    </Glyph>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M13.2 9.6A5.6 5.6 0 0 1 6.4 2.8a5.6 5.6 0 1 0 6.8 6.8z" />
    </Glyph>
  );
}

export function ComposeIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M12.4 2.2a1.55 1.55 0 0 1 2.2 2.2L8.3 10.7l-2.9.8.8-2.9z" />
      <path d="M12.6 9.4V13a1.5 1.5 0 0 1-1.5 1.5H3.4A1.5 1.5 0 0 1 1.9 13V5.3a1.5 1.5 0 0 1 1.5-1.5H7" />
    </Glyph>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="6.1" cy="5.4" r="2.4" />
      <path d="M1.7 13.6a4.4 4.4 0 0 1 8.8 0" />
      <path d="M10.7 3.3a2.4 2.4 0 0 1 0 4.2" />
      <path d="M11.9 9.6a4.4 4.4 0 0 1 2.4 4" />
    </Glyph>
  );
}
