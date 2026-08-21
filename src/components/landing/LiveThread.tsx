import { Avatar } from "@/components/ui/Avatar";
import { CheckIcon } from "@/components/ui/icons";

type Line = {
  id: string;
  from: string;
  name: string;
  text: string;
  time: string;
  mine?: boolean;
};

const SCRIPT: Line[] = [
  { id: "l1", from: "u_a913", name: "Ahsan Mahfuz", text: "staging is back up", time: "09:22" },
  {
    id: "l2",
    from: "u_2b8e",
    name: "Forhad Hossain",
    text: "was it the socket again",
    time: "09:22",
  },
  {
    id: "l3",
    from: "u_me_01",
    name: "you",
    text: "yeah, it drops every 30s on hotel wifi",
    time: "09:23",
    mine: true,
  },
  {
    id: "l4",
    from: "u_7f21",
    name: "Shirazul Islam",
    text: "long polling fallback then?",
    time: "09:24",
  },
  { id: "l5", from: "u_me_01", name: "you", text: "already pushed it", time: "09:24", mine: true },
];

const STEP_MS = 850;

export function LiveThread() {
  return (
    <div className="overflow-hidden border border-line bg-surface shadow-e3">
      <div className="relative z-10 flex items-center gap-3 border-b border-line bg-surface px-4 py-3">
        <Avatar id="conv_gs" name="gateway sockets" size={36} />
        <div className="min-w-0">
          <p className="truncate text-[14.5px] font-semibold text-ink">gateway + sockets</p>
          <p className="text-meta truncate text-muted">6 members</p>
        </div>
        <span className="text-meta ml-auto flex shrink-0 items-center gap-1.5 bg-accent-soft px-2.5 py-1 text-accent">
          <span aria-hidden className="size-1.5 bg-current" />
          live
        </span>
      </div>

      <div className="relative h-67 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 flex flex-col px-4 pb-3">
          {SCRIPT.map((line, index) => {
            const previous = SCRIPT[index - 1];
            const startsRun = !previous || previous.from !== line.from;
            const delay = index * STEP_MS;

            return (
              <div
                key={line.id}
                className={`flex gap-2 ${line.mine ? "justify-end" : "justify-start"}`}
                style={{
                  marginTop: startsRun ? 12 : 3,
                  animation: `rise 340ms ease-out ${delay}ms both`,
                }}
              >
                {!line.mine && (
                  <span className="w-6 shrink-0">
                    {startsRun && <Avatar id={line.from} name={line.name} size={24} />}
                  </span>
                )}
                <div className={`max-w-[76%] ${line.mine ? "text-right" : ""}`}>
                  {startsRun && !line.mine && (
                    <p className="mb-1 truncate text-[12.5px] font-medium text-muted">
                      {line.name}
                    </p>
                  )}
                  <div
                    className={`inline-block px-3 py-2 text-left ${
                      line.mine
                        ? "bg-accent text-accent-ink"
                        : "border border-line bg-surface-2 text-ink"
                    }`}
                  >
                    <p className="text-body break-anywhere">{line.text}</p>
                    <span className="mt-0.5 flex items-center justify-end gap-1">
                      <span className={`text-meta ${line.mine ? "opacity-70" : "text-faint"}`}>
                        {line.time}
                      </span>
                      {line.mine && (
                        <span
                          aria-label="Sent"
                          className="text-[11px] opacity-70"
                          style={{ animation: `pop 260ms ease-out ${delay + 520}ms both` }}
                        >
                          <CheckIcon />
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-linear-to-b from-surface to-transparent"
        />
      </div>

      <div className="flex items-center gap-2 border-t border-line px-3 py-2.5">
        <span className="text-body flex h-10 flex-1 items-center border border-line bg-surface-2 px-3 text-faint">
          Message gateway + sockets
        </span>
        <span className="text-meta flex h-10 items-center bg-surface-2 px-4 font-medium text-faint">
          Send
        </span>
      </div>
    </div>
  );
}
