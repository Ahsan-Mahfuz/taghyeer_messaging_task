"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "@/lib/api";
import { isValidPhone, toLocalPhone } from "@/lib/session";
import { useSession } from "@/hooks/useSession";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { Wordmark } from "@/components/ui/Wordmark";
import { ChevronLeftIcon } from "@/components/ui/icons";

const PROMISES = ["no password", "no email", "no verification code"];

export function LoginCard() {
  const { signIn } = useSession();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const local = toLocalPhone(phone);
  const ready = isValidPhone(phone) && name.trim().length > 0;
  const rewritten = ready && local !== phone.trim();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPhoneError(
      isValidPhone(phone) ? null : "That does not look like a Bangladeshi mobile number.",
    );
    setNameError(name.trim() ? null : "Pick a name so people know who you are.");
    if (!ready) return;

    setBusy(true);
    setFormError(null);
    try {
      signIn(await api.login(local, name.trim()));
    } catch (cause) {
      setFormError(cause instanceof Error ? cause.message : "Could not reach the server.");
      setBusy(false);
    }
  }

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-bg px-5 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-18%] left-1/2 size-140 -translate-x-1/2 bg-accent/12 blur-[120px]"
      />

      <form
        onSubmit={submit}
        noValidate
        className="relative w-full max-w-105 border border-line bg-surface p-7 shadow-e3"
      >
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            aria-label="Back to home"
            className="-ml-1.5 flex size-8 items-center justify-center text-muted transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <ChevronLeftIcon size={15} />
          </Link>
          <Wordmark />
        </div>
        <h1 className="mt-6 font-display text-[28px] leading-tight font-bold text-ink">
          Start chatting
        </h1>
        <p className="mt-2 text-[14.5px] leading-normal text-muted">
          Your phone number is your account. There is nothing else to sign up for.
        </p>

        {formError && (
          <p role="alert" className="mt-5 bg-danger-soft px-3 py-2.5 text-[13px] text-danger">
            {formError}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-4">
          <TextField
            label="Phone number"
            hint={
              rewritten
                ? `Saved as ${local} so people can find you by number`
                : "01... or +8801... both work"
            }
            error={phoneError}
            mono
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            autoFocus
            disabled={busy}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          <TextField
            label="Display name"
            hint="This is the name everyone you chat with will see."
            error={nameError}
            autoComplete="name"
            maxLength={64}
            disabled={busy}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <Button
          type="submit"
          busy={busy}
          busyLabel="Connecting"
          disabled={!ready}
          className="mt-6 w-full"
        >
          Start chatting
        </Button>
      </form>

      <ul className="relative mt-6 flex flex-wrap justify-center gap-2">
        {PROMISES.map((promise) => (
          <li key={promise} className="text-meta border border-line px-3 py-1.5 text-muted">
            {promise}
          </li>
        ))}
      </ul>
    </main>
  );
}
