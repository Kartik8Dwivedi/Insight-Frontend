import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

let cachedData: any[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 60 * 1000;

export async function GET() {
  if (cachedData && Date.now() - cacheTime < CACHE_TTL) {
    return NextResponse.json(cachedData, {
      headers: { "Cache-Control": "private, no-store" },
    });
  }

  const blobUrl = process.env.ANALYTICS_BLOB_URL;

  // Try Blob first, fall back to local file
  if (blobUrl) {
    try {
      const res = await fetch(blobUrl);
      if (res.ok) {
        cachedData = await res.json();
        cacheTime = Date.now();
        return NextResponse.json(cachedData, {
          headers: { "Cache-Control": "private, no-store" },
        });
      }
    } catch {}
  }

  // Fallback: serve from the analytics.json bundled with the app
  try {
    const filePath = path.join(process.cwd(), "analytics.json");
    const raw = fs.readFileSync(filePath, "utf8");
    cachedData = JSON.parse(raw);
    cacheTime = Date.now();
    return NextResponse.json(cachedData, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch {
    return NextResponse.json(
      { error: "Data source not configured" },
      { status: 503 },
    );
  }
}
