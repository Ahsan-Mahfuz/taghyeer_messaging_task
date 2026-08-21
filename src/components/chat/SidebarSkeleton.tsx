const WIDTHS = ["58%", "44%", "66%", "38%", "52%", "48%"];
const SUB_WIDTHS = ["72%", "84%", "60%", "76%", "66%", "80%"];

export function SidebarSkeleton() {
  return (
    <ul aria-hidden>
      {WIDTHS.map((width, index) => (
        <li key={width} className="flex h-[54px] items-center gap-3 px-4">
          <span className="skeleton size-9" />
          <span className="flex-1 space-y-1.5">
            <span className="skeleton block h-3" style={{ width }} />
            <span className="skeleton block h-2.5" style={{ width: SUB_WIDTHS[index] }} />
          </span>
        </li>
      ))}
    </ul>
  );
}
