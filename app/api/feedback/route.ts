import { NextRequest, NextResponse } from "next/server";
import { put, list, get } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const timestamp = Date.now();
    const id = `fb_${timestamp}_${Math.random().toString(36).slice(2, 8)}`;

    const feedback = {
      id,
      timestamp,
      date: new Date(timestamp).toISOString(),
      helpful: body.helpful ?? null, // 'yes' | 'somewhat' | 'no'
      features: body.features ?? [], // string[]
      rating: body.rating ?? null, // 1-5
      message: (body.message ?? "").slice(0, 2000),
      requestedFeature: (body.requestedFeature ?? "").slice(0, 500),
    };

    await put(`feedback/${id}.json`, JSON.stringify(feedback), {
      access: "public",
      contentType: "application/json",
    });

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    console.error("Feedback submit error:", err);
    return NextResponse.json(
      { error: "Failed to save feedback" },
      { status: 500 },
    );
  }
}

// Admin only - list all feedback
export async function GET(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  if (token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { blobs } = await list({ prefix: "feedback/" });
    const items = await Promise.all(
      blobs.map(async (blob) => {
        try {
          const res = await fetch(blob.url);
          return await res.json();
        } catch {
          return null;
        }
      }),
    );
    return NextResponse.json(
      items.filter(Boolean).sort((a, b) => b.timestamp - a.timestamp),
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
