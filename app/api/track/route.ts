import { NextRequest, NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const timestamp = Date.now();
    const date = new Date(timestamp);
    // Group events by day so we don't create millions of tiny files
    // Each day file is a newline-delimited JSON (NDJSON) blob
    const dayKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;

    const event = {
      t: timestamp,
      type: body.type, // 'pageview' | 'session_end' | 'filter_used' | 'ai_search' | 'feedback_opened'
      sessionId: body.sessionId ?? "",
      duration: body.duration ?? null, // seconds, for session_end
      meta: body.meta ?? {}, // extra context (filter name, search query snippet, etc.)
      // No PII — no IP, no user agent beyond basic device type
      isMobile: body.isMobile ?? false,
    };

    // Read existing day file, append, rewrite
    // This is fine for low traffic (< 10k events/day). For higher traffic use a queue.
    let existing = "";
    try {
      const { blobs } = await list({ prefix: `events/${dayKey}.ndjson` });
      if (blobs.length > 0) {
        const res = await fetch(blobs[0].url);
        existing = await res.text();
      }
    } catch {
      /* first event of the day */
    }

    const newContent = existing
      ? existing.trimEnd() + "\n" + JSON.stringify(event)
      : JSON.stringify(event);

    await put(`events/${dayKey}.ndjson`, newContent, {
      access: "public",
      contentType: "application/x-ndjson",
      allowOverwrite: true,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    // Never fail silently on the client for tracking
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

// Admin only - get all events for a date range
export async function GET(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  if (token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { blobs } = await list({ prefix: "events/" });
    const allEvents: any[] = [];

    for (const blob of blobs.sort((a, b) =>
      a.pathname.localeCompare(b.pathname),
    )) {
      try {
        const res = await fetch(blob.url);
        const text = await res.text();
        const dayEvents = text
          .split("\n")
          .filter(Boolean)
          .map((line) => {
            try {
              return JSON.parse(line);
            } catch {
              return null;
            }
          })
          .filter(Boolean);
        allEvents.push(...dayEvents);
      } catch {
        /* skip bad day files */
      }
    }

    return NextResponse.json(allEvents);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
