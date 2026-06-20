"use client";
import { useEffect, useRef, useCallback } from "react";

// Stable session ID for this browser tab (not stored, resets on close)
let _sessionId: string | null = null;
function getSessionId() {
  if (!_sessionId)
    _sessionId = `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return _sessionId;
}

function isMobileDevice() {
  return typeof window !== "undefined" && window.innerWidth < 768;
}

async function sendEvent(
  type: string,
  meta: Record<string, any> = {},
  duration?: number,
) {
  try {
    const page = typeof window !== "undefined" ? window.location.pathname : "";
    const referrer = typeof document !== "undefined" ? document.referrer : "";

    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        sessionId: getSessionId(),
        isMobile: isMobileDevice(),
        page,
        referrer,
        meta,
        duration: duration ?? null,
      }),
      // Use keepalive so session_end fires even on page close
      keepalive: true,
    });
  } catch {
    /* never block the UI */
  }
}

/**
 * Drop this hook into any page to track pageviews + session duration automatically.
 * Call the returned helpers to track specific interactions.
 */
export function useTracker(pageName: string) {
  const startTime = useRef(Date.now());
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    sendEvent("pageview", { pageName });

    const handleUnload = () => {
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      sendEvent("session_end", { pageName }, duration);
    };

    window.addEventListener("beforeunload", handleUnload);
    // Also fire on visibility hidden (mobile tab switch)
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        const duration = Math.round((Date.now() - startTime.current) / 1000);
        sendEvent("session_end", { pageName }, duration);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [pageName]);

  const trackFilterUsed = useCallback((filterName: string, value: string) => {
    sendEvent("filter_used", { filter: filterName, value });
  }, []);

  const trackAISearch = useCallback((query: string) => {
    // Only send first 60 chars — enough for analytics, no privacy issues
    sendEvent("ai_search", { query: query.slice(0, 60) });
  }, []);

  const trackFeedbackOpened = useCallback(() => {
    sendEvent("feedback_opened", {});
  }, []);

  const trackClick = useCallback((elementName: string, meta: Record<string, any> = {}) => {
    sendEvent("click", { element: elementName, ...meta });
  }, []);

  return { trackFilterUsed, trackAISearch, trackFeedbackOpened, trackClick };
}
