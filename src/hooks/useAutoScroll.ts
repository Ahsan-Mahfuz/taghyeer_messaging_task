"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const PIN_THRESHOLD = 200;

export function useAutoScroll(latestKey: string | undefined) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(true);
  const [missed, setMissed] = useState(0);

  const pinnedRef = useRef(true);
  const lastSeenKey = useRef<string | undefined>(undefined);
  const restoreHeight = useRef<number | null>(null);

  useEffect(() => {
    pinnedRef.current = pinned;
  }, [pinned]);

  const scrollToLatest = useCallback((behavior: ScrollBehavior = "smooth") => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.scrollTo({ top: viewport.scrollHeight, behavior });
    setMissed(0);
  }, []);

  const handleScroll = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const distance = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
    const nowPinned = distance < PIN_THRESHOLD;
    setPinned(nowPinned);
    if (nowPinned) setMissed(0);
  }, []);

  const captureBeforeOlder = useCallback(() => {
    const viewport = viewportRef.current;
    if (viewport) restoreHeight.current = viewport.scrollHeight;
  }, []);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    if (restoreHeight.current !== null) {
      viewport.scrollTop += viewport.scrollHeight - restoreHeight.current;
      restoreHeight.current = null;
      return;
    }

    if (!latestKey || latestKey === lastSeenKey.current) return;

    const isFirstPaint = lastSeenKey.current === undefined;
    lastSeenKey.current = latestKey;

    if (isFirstPaint) {
      viewport.scrollTop = viewport.scrollHeight;
      return;
    }

    if (pinnedRef.current) viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
    else setMissed((count) => count + 1);
  }, [latestKey]);

  return {
    viewportRef,
    pinned,
    missed,
    onScroll: handleScroll,
    scrollToLatest,
    captureBeforeOlder,
  };
}
