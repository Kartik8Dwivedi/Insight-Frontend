import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Feedback from "@/models/Feedback";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const timestamp = Date.now();

    const feedback = new Feedback({
      timestamp,
      date: new Date(timestamp).toISOString(),
      helpful: body.helpful ?? null,
      features: body.features ?? [],
      rating: body.rating ?? null,
      message: (body.message ?? "").slice(0, 2000),
      requestedFeature: (body.requestedFeature ?? "").slice(0, 500),
      email: body.email || null,
    });

    await feedback.save();

    return NextResponse.json({ success: true, id: feedback._id });
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
    await dbConnect();
    const feedbacks = await Feedback.find({})
      .sort({ timestamp: -1 })
      .lean();

    return NextResponse.json(feedbacks);
  } catch (err: any) {
    console.error("Feedback list error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
