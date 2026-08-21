"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { clearSession, readSession, writeSession } from "@/lib/session";
import type { Session, User } from "@/lib/types";

type SessionValue = {
  session: Session | null;
  user: User | null;
  restoring: boolean;
  signIn: (session: Session) => void;
  signOut: () => void;
};

const Context = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [restoring, setRestoring] = useState(true);

  useEffect(() => {
    let alive = true;

    async function restore() {
      const stored = readSession();
      if (!stored) return;
      try {
        const user = await api.me(stored.token);
        if (!alive) return;
        const refreshed = { token: stored.token, user };
        writeSession(refreshed);
        setSession(refreshed);
      } catch {
        clearSession();
      }
    }

    restore().finally(() => {
      if (alive) setRestoring(false);
    });

    return () => {
      alive = false;
    };
  }, []);

  const signIn = useCallback((next: Session) => {
    writeSession(next);
    setSession(next);
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ session, user: session?.user ?? null, restoring, signIn, signOut }),
    [session, restoring, signIn, signOut],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useSession(): SessionValue {
  const value = useContext(Context);
  if (!value) throw new Error("useSession must be used inside SessionProvider");
  return value;
}
