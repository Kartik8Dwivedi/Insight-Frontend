import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Event from "@/models/Event";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const timestamp = Date.now();

    // Connect to DB (cached)
    await dbConnect();

    // Create a new event log entry
    const event = new Event({
      t: timestamp,
      type: body.type, // 'pageview' | 'session_end' | 'filter_used' | 'ai_search' | 'feedback_opened' | 'click'
      sessionId: body.sessionId ?? "",
      page: body.page || null,
      referrer: body.referrer || null,
      duration: body.duration ?? null,
      meta: body.meta ?? {},
      isMobile: body.isMobile ?? false,
    });

    // Save it as soon as possible
    // Using save() is fine for low-to-medium traffic. For high-volume, consider a queue.
    await event.save();

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    // Return 200 even on error to avoid breaking client-side tracking
    console.error("Track error:", err);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

// Admin only - fetch events
export async function GET(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  if (token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    
    // Fetch last 30 days of events by default to avoid huge payloads
    // We sort by timestamp descending
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    
    const events = await Event.find({
      t: { $gte: thirtyDaysAgo }
    })
    .sort({ t: -1 })
    .limit(10000) // Sanity limit for large traffic
    .lean();

    return NextResponse.json(events);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
