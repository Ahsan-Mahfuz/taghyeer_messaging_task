"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { PublicUser } from "@/lib/types";
import { useSession } from "./useSession";

const MIN_LENGTH = 2;
const DEBOUNCE_MS = 300;

type Outcome = {
  term: string;
  results: PublicUser[];
  error: string | null;
};

const IDLE: Outcome = { term: "", results: [], error: null };

export function useUserSearch(term: string) {
  const { session } = useSession();
  const token = session?.token ?? null;
  const myId = session?.user._id ?? null;

  const [outcome, setOutcome] = useState<Outcome>(IDLE);

  const trimmed = term.trim();
  const tooShort = trimmed.length < MIN_LENGTH;

  useEffect(() => {
    if (!token || tooShort) return;

    let alive = true;
    const timer = setTimeout(() => {
      api
        .searchUsers(token, trimmed)
        .then((found) => {
          if (alive) setOutcome({ term: trimmed, results: found, error: null });
        })
        .catch(() => {
          if (alive) {
            setOutcome({
              term: trimmed,
              results: [],
              error: "Search is not responding. Try again in a moment.",
            });
          }
        });
    }, DEBOUNCE_MS);

    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [token, trimmed, tooShort]);

  const settled = outcome.term === trimmed;

  return {
    results: settled ? outcome.results.filter((person) => person._id !== myId) : [],
    error: settled ? outcome.error : null,
    searching: !tooShort && !settled,
    tooShort,
  };
}
