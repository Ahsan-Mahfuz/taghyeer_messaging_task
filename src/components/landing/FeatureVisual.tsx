import { Avatar } from "@/components/ui/Avatar";

const CROWD = [
  { id: "u_a913", name: "Ahsan Mahfuz" },
  { id: "u_2b8e", name: "Forhad Hossain" },
  { id: "u_7f21", name: "Shirazul Islam" },
  { id: "u_c440", name: "Nusrat Jahan" },
];

export function ReconnectVisual() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-1.5">
      <div className="text-meta flex h-[30px] items-center justify-center gap-2 bg-warn-soft px-3 text-warn">
        <span
          aria-hidden
          className="size-2.5 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
        Reconnecting, attempt 2 of 5
      </div>
      <div className="flex justify-end">
        <span className="text-meta flex items-center gap-1.5 bg-accent px-2.5 py-1.5 text-accent-ink">
          queued
          <span aria-hidden className="opacity-60">
            &middot;&middot;&middot;
          </span>
        </span>
      </div>
    </div>
  );
}

export function GroupVisual() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex -space-x-2.5">
        {CROWD.map((person) => (
          <span key={person.id} className="ring-2 ring-surface">
            <Avatar id={person.id} name={person.name} size={36} />
          </span>
        ))}
        <span className="text-meta flex size-9 items-center justify-center bg-surface-2 text-muted ring-2 ring-surface">
          +56
        </span>
      </div>
    </div>
  );
}

export function PrivacyVisual() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-4">
      <ul className="text-meta space-y-1 text-muted">
        <li>+8801700000001</li>
        <li>Ahsan Mahfuz</li>
        <li className="text-faint line-through">photo</li>
        <li className="text-faint line-through">password</li>
      </ul>
      <Avatar id="u_a913" name="Ahsan Mahfuz" size={44} />
    </div>
  );
}
