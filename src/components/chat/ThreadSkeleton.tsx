const ROWS = [
  { mine: false, width: 180 },
  { mine: false, width: 96 },
  { mine: true, width: 220 },
  { mine: true, width: 140 },
  { mine: false, width: 260 },
  { mine: true, width: 110 },
  { mine: false, width: 200 },
];

export function ThreadSkeleton() {
  return (
    <div aria-hidden className="h-full space-y-3 overflow-hidden px-4 py-4 md:px-6">
      {ROWS.map((row, index) => (
        <div key={index} className={`flex gap-2 ${row.mine ? "justify-end" : "justify-start"}`}>
          {!row.mine && <span className="skeleton size-6 shrink-0" />}
          <span className="skeleton block h-9" style={{ width: row.width, maxWidth: "70%" }} />
        </div>
      ))}
    </div>
  );
}
