import { NextResponse } from "next/server";

// Module-level cache — survives across requests in the same function instance
let cachedData: any[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function GET() {
  // Serve from memory if fresh
  if (cachedData && Date.now() - cacheTime < CACHE_TTL) {
    return NextResponse.json(cachedData, {
      headers: {
        "Cache-Control": "private, no-store", // Browser must not cache this
        "X-Data-Source": "memory",
      },
    });
  }

  const blobUrl = process.env.ANALYTICS_BLOB_URL;
  if (!blobUrl) {
    return NextResponse.json(
      { error: "Data source not configured" },
      { status: 503 },
    );
  }

  const res = await fetch(blobUrl);
  cachedData = await res.json();
  cacheTime = Date.now();

  return NextResponse.json(cachedData, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
