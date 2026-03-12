import { NextRequest, NextResponse } from "next/server";

const getCleanBackendUrl = () => {
  let url = process.env.BACKEND_URL || "http://localhost:8001";
  if (!url.includes("/api/v1")) {
    url = url.endsWith("/") ? `${url}api/v1` : `${url}/api/v1`;
  }
  return url;
};

const BACKEND_URL = getCleanBackendUrl();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const backendParams = new URLSearchParams();
  
  // Robust mapping: Handle comma separated values
  const domain = searchParams.get("domains");
  if (domain && domain !== "undefined" && domain !== "") {
    const subjects = domain.split(",").map(d => d === "Maths" ? "Mathematics" : d).join(",");
    backendParams.set("subject", subjects);
  }
  
  const chapter = searchParams.get("chapters");
  if (chapter && chapter !== "undefined" && chapter !== "") {
    backendParams.set("chapter", chapter);
  }

  const topic = searchParams.get("topics");
  if (topic && topic !== "undefined" && topic !== "") {
    backendParams.set("topic", topic);
  }

  const category = searchParams.get("categories");
  if (category && category !== "undefined" && category !== "") {
    backendParams.set("category", category);
  }

  const difficulty = searchParams.get("difficulties");
  if (difficulty && difficulty !== "undefined" && difficulty !== "") {
    backendParams.set("difficulty", difficulty);
  }

  const yearStart = searchParams.get("yearStart");
  if (yearStart && yearStart !== "undefined" && yearStart !== "") {
    backendParams.set("yearStart", yearStart);
  }

  const yearEnd = searchParams.get("yearEnd");
  if (yearEnd && yearEnd !== "undefined" && yearEnd !== "") {
    backendParams.set("yearEnd", yearEnd);
  }

  backendParams.set("limit", "1000");

  const fullUrl = `${BACKEND_URL}/questions?${backendParams.toString()}`;
  const statsUrl = `${BACKEND_URL}/questions/stats?${backendParams.toString()}`;
  console.log(`Proxying to backend: ${fullUrl} and ${statsUrl}`);

  try {
    const [res, statsRes] = await Promise.all([
      fetch(fullUrl, { cache: 'no-store' }),
      fetch(statsUrl, { cache: 'no-store' })
    ]);

    if (!res.ok) {
      return NextResponse.json({ status: res.status, filteredData: [], mockData: [], stats: null });
    }

    const json = await res.json();
    const statsJson = statsRes.ok ? await statsRes.json() : null;
    
    if (!json.success || !json.data) {
      return NextResponse.json({ status: 200, filteredData: [], mockData: [], stats: null });
    }

    const mappedData = json.data.map((item: any) => ({
      ...item,
      id: item._id,
      domain: item.subject === "Mathematics" ? "Maths" : item.subject,
      difficulty: item.averageDifficulty || item.history?.[0]?.difficulty || 'Medium',
      category: item.mainCategory || item.history?.[0]?.category || 'Conceptual',
      year: item.history?.[0]?.year || 2024
    }));

    return NextResponse.json({
      status: 200,
      filteredData: mappedData,
      mockData: mappedData,
      stats: Array.isArray(statsJson?.data) ? statsJson.data[0] : (statsJson?.data || null)
    });
  } catch (error: any) {
    console.error("Proxy Fetch Error:", error.message);
    return NextResponse.json({ status: 500, filteredData: [], mockData: [] });
  }
}
