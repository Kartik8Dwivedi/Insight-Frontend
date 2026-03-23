"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Users,
  Clock,
  MousePointer,
  Star,
  MessageSquare,
  TrendingUp,
  BarChart2,
  Search,
  Filter,
  Eye,
  LogOut,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ── Auth gate ─────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Client-side check against env vars baked at build time
    // NEXT_PUBLIC_ADMIN_USER and NEXT_PUBLIC_ADMIN_PASS are set in Vercel
    const validUser = process.env.NEXT_PUBLIC_ADMIN_USER;
    const validPass = process.env.NEXT_PUBLIC_ADMIN_PASS;
    await new Promise((r) => setTimeout(r, 400)); // Slight delay to prevent brute force
    if (username === validUser && password === validPass) {
      const token = btoa(`${username}:${password}`); // simple token for API calls
      sessionStorage.setItem("admin_token", token);
      onLogin(token);
    } else {
      setError("Invalid credentials");
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#0f1117" }}
    >
      <div
        className="w-full max-w-sm p-8 rounded-2xl"
        style={{ background: "#1a1d27", border: "1px solid #2a2d3a" }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "#4f46e5" }}
          >
            <BarChart2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">Admin Panel</p>
            <p className="text-xs" style={{ color: "#6b7280" }}>
              JEE Dashboard Analytics
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-xs font-medium mb-1.5"
              style={{ color: "#9ca3af" }}
            >
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
              style={{
                background: "#0f1117",
                border: "1px solid #2a2d3a",
                color: "#fff",
              }}
              autoComplete="username"
            />
          </div>
          <div>
            <label
              className="block text-xs font-medium mb-1.5"
              style={{ color: "#9ca3af" }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
              style={{
                background: "#0f1117",
                border: "1px solid #2a2d3a",
                color: "#fff",
              }}
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ background: "#4f46e5" }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = "#4f46e5",
}: {
  icon: any;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div
      className="p-5 rounded-2xl"
      style={{ background: "#1a1d27", border: "1px solid #2a2d3a" }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${color}22` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <span className="text-xs" style={{ color: "#6b7280" }}>
          {label}
        </span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && (
        <p className="text-xs mt-1" style={{ color: "#6b7280" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

// ── Feedback card ─────────────────────────────────────────────────────────────
function FeedbackCard({ fb }: { fb: any }) {
  const [expanded, setExpanded] = useState(false);
  const stars = fb.rating;
  return (
    <div
      className="p-4 rounded-xl"
      style={{ background: "#0f1117", border: "1px solid #2a2d3a" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {stars && (
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className="w-3.5 h-3.5"
                  style={{
                    fill: n <= stars ? "#4f46e5" : "none",
                    stroke: n <= stars ? "#4f46e5" : "#4b5563",
                  }}
                />
              ))}
            </div>
          )}
          {fb.helpful && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "#1e293b", color: "#94a3b8" }}
            >
              {fb.helpful === "yes"
                ? "👍 Helpful"
                : fb.helpful === "somewhat"
                  ? "🤔 Somewhat"
                  : "👎 Not helpful"}
            </span>
          )}
          {fb.features?.map((f: string) => (
            <span
              key={f}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "#312e81", color: "#c4b5fd" }}
            >
              {f}
            </span>
          ))}
        </div>
        <span className="text-xs flex-shrink-0" style={{ color: "#4b5563" }}>
          {new Date(fb.timestamp).toLocaleDateString()}
        </span>
      </div>
      {(fb.message || fb.requestedFeature) && (
        <div className="mt-2">
          <button
            onClick={() => setExpanded((e) => !e)}
            className="flex items-center gap-1 text-xs"
            style={{ color: "#6b7280" }}
          >
            {expanded ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
            {expanded ? "Hide" : "Show"} message
          </button>
          {expanded && (
            <div className="mt-2 space-y-1">
              {fb.requestedFeature && (
                <p className="text-xs" style={{ color: "#a78bfa" }}>
                  💡 {fb.requestedFeature}
                </p>
              )}
              {fb.message && (
                <p className="text-xs" style={{ color: "#9ca3af" }}>
                  {fb.message}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const COLORS = [
  "#4f46e5",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
];

// ── Main admin dashboard ──────────────────────────────────────────────────────
function AdminDashboard({
  token,
  onLogout,
}: {
  token: string;
  onLogout: () => void;
}) {
  const [events, setEvents] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const headers = { "x-admin-token": atob(token).split(":")[1] };

  const load = async () => {
    setLoading(true);
    try {
      const [evRes, fbRes] = await Promise.all([
        fetch("/api/track", { headers }),
        fetch("/api/feedback", { headers }),
      ]);
      if (evRes.status === 401 || fbRes.status === 401) {
        onLogout();
        return;
      }
      setEvents(await evRes.json());
      setFeedbacks(await fbRes.json());
      setLastRefresh(new Date());
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // ── Derived metrics ───────────────────────────────────────────────────────
  const metrics = useMemo(() => {
    if (!events.length) return null;

    const pageviews = events.filter((e) => e.type === "pageview");
    const sessions = events.filter((e) => e.type === "session_end");
    const filterEvents = events.filter((e) => e.type === "filter_used");
    const aiSearches = events.filter((e) => e.type === "ai_search");

    const uniqueSessions = new Set(pageviews.map((e) => e.sessionId)).size;
    const avgDuration = sessions.length
      ? Math.round(
          sessions.reduce((s, e) => s + (e.duration ?? 0), 0) / sessions.length,
        )
      : 0;

    // Daily pageviews for chart
    const dailyMap: Record<string, number> = {};
    for (const e of pageviews) {
      const day = new Date(e.t).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      });
      dailyMap[day] = (dailyMap[day] ?? 0) + 1;
    }
    const dailyViews = Object.entries(dailyMap)
      .map(([date, views]) => ({ date, views }))
      .slice(-14); // last 14 days

    // Filter usage breakdown
    const filterMap: Record<string, number> = {};
    for (const e of filterEvents) {
      const k = e.meta?.filter ?? "unknown";
      filterMap[k] = (filterMap[k] ?? 0) + 1;
    }
    const filterBreakdown = Object.entries(filterMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // AI search queries
    const recentSearches = aiSearches
      .slice(-20)
      .reverse()
      .map((e) => e.meta?.query ?? "");

    // Mobile vs desktop
    const mobileCount = pageviews.filter((e) => e.isMobile).length;
    const deviceSplit = [
      { name: "Desktop", value: pageviews.length - mobileCount },
      { name: "Mobile", value: mobileCount },
    ];

    return {
      uniqueSessions,
      avgDuration,
      filterEvents,
      aiSearches,
      dailyViews,
      filterBreakdown,
      recentSearches,
      deviceSplit,
      pageviews,
    };
  }, [events]);

  const feedbackMetrics = useMemo(() => {
    if (!feedbacks.length) return null;
    const rated = feedbacks.filter((f) => f.rating != null);
    const avgRating = rated.length
      ? (rated.reduce((s, f) => s + f.rating, 0) / rated.length).toFixed(1)
      : "N/A";
    const helpfulCount = feedbacks.filter((f) => f.helpful === "yes").length;
    const featureMap: Record<string, number> = {};
    for (const f of feedbacks) {
      for (const feat of f.features ?? []) {
        featureMap[feat] = (featureMap[feat] ?? 0) + 1;
      }
    }
    const topFeatures = Object.entries(featureMap).sort((a, b) => b[1] - a[1]);
    const requestedFeatures = feedbacks
      .filter((f) => f.requestedFeature)
      .map((f) => f.requestedFeature);
    return { avgRating, helpfulCount, topFeatures, requestedFeatures };
  }, [feedbacks]);

  const s = { color: "#9ca3af", fontSize: 11 };

  return (
    <div
      className="min-h-screen"
      style={{ background: "#0f1117", color: "#fff" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: "#2a2d3a", background: "#1a1d27" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "#4f46e5" }}
          >
            <BarChart2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm">Admin Panel</p>
            <p className="text-xs" style={{ color: "#6b7280" }}>
              JEE Dashboard · Analytics & Feedback
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {lastRefresh && (
            <span className="text-xs" style={{ color: "#4b5563" }}>
              Updated {lastRefresh.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors"
            style={{ background: "#2a2d3a", color: "#9ca3af" }}
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors"
            style={{ background: "#2a2d3a", color: "#9ca3af" }}
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>

      {loading && !metrics ? (
        <div className="flex items-center justify-center py-32 gap-2">
          <Loader2
            className="w-5 h-5 animate-spin"
            style={{ color: "#4f46e5" }}
          />
          <span style={{ color: "#6b7280" }}>Loading analytics…</span>
        </div>
      ) : (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
          {/* ── Traffic stats ─────────────────────────────────────────── */}
          <div>
            <p
              className="text-xs font-semibold mb-3 uppercase tracking-wider"
              style={{ color: "#4b5563" }}
            >
              Traffic overview
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={Eye}
                label="Total pageviews"
                value={metrics?.pageviews.length ?? 0}
                color="#4f46e5"
              />
              <StatCard
                icon={Users}
                label="Unique sessions"
                value={metrics?.uniqueSessions ?? 0}
                color="#06b6d4"
              />
              <StatCard
                icon={Clock}
                label="Avg session"
                value={
                  metrics
                    ? `${Math.floor((metrics.avgDuration ?? 0) / 60)}m ${(metrics.avgDuration ?? 0) % 60}s`
                    : "—"
                }
                color="#10b981"
              />
              <StatCard
                icon={Search}
                label="AI searches"
                value={metrics?.aiSearches.length ?? 0}
                color="#f59e0b"
              />
            </div>
          </div>

          {/* ── Daily chart + device split ────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div
              className="lg:col-span-2 p-5 rounded-2xl"
              style={{ background: "#1a1d27", border: "1px solid #2a2d3a" }}
            >
              <p className="text-sm font-semibold mb-4">
                Daily pageviews (last 14 days)
              </p>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={metrics?.dailyViews ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
                  <XAxis
                    dataKey="date"
                    tick={s}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={s}
                    axisLine={false}
                    tickLine={false}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#1a1d27",
                      border: "1px solid #2a2d3a",
                      borderRadius: 8,
                      color: "#fff",
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#4f46e5" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div
              className="p-5 rounded-2xl"
              style={{ background: "#1a1d27", border: "1px solid #2a2d3a" }}
            >
              <p className="text-sm font-semibold mb-4">Device split</p>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={metrics?.deviceSplit ?? []}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {(metrics?.deviceSplit ?? []).map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#1a1d27",
                      border: "1px solid #2a2d3a",
                      borderRadius: 8,
                      color: "#fff",
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex gap-4 justify-center">
                {(metrics?.deviceSplit ?? []).map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: COLORS[i] }}
                    />
                    <span className="text-xs" style={{ color: "#9ca3af" }}>
                      {d.name} ({d.value})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Filter usage + AI searches ────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div
              className="p-5 rounded-2xl"
              style={{ background: "#1a1d27", border: "1px solid #2a2d3a" }}
            >
              <p className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" style={{ color: "#4f46e5" }} />
                Filter usage
              </p>
              {(metrics?.filterBreakdown ?? []).length === 0 ? (
                <p className="text-xs" style={{ color: "#4b5563" }}>
                  No filter events yet
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart
                    data={metrics?.filterBreakdown ?? []}
                    layout="vertical"
                  >
                    <XAxis
                      type="number"
                      tick={s}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={s}
                      axisLine={false}
                      tickLine={false}
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#1a1d27",
                        border: "1px solid #2a2d3a",
                        borderRadius: 8,
                        color: "#fff",
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="count" fill="#4f46e5" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            <div
              className="p-5 rounded-2xl"
              style={{ background: "#1a1d27", border: "1px solid #2a2d3a" }}
            >
              <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Search className="w-4 h-4" style={{ color: "#f59e0b" }} />
                Recent AI searches
              </p>
              {(metrics?.recentSearches ?? []).length === 0 ? (
                <p className="text-xs" style={{ color: "#4b5563" }}>
                  No searches yet
                </p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {(metrics?.recentSearches ?? []).map((q, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span
                        className="text-xs mt-0.5"
                        style={{ color: "#4b5563" }}
                      >
                        {i + 1}.
                      </span>
                      <span className="text-xs" style={{ color: "#d1d5db" }}>
                        {q}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Feedback section ──────────────────────────────────────── */}
          <div>
            <p
              className="text-xs font-semibold mb-3 uppercase tracking-wider"
              style={{ color: "#4b5563" }}
            >
              Feedback
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <StatCard
                icon={MessageSquare}
                label="Total responses"
                value={feedbacks.length}
                color="#8b5cf6"
              />
              <StatCard
                icon={Star}
                label="Avg rating"
                value={feedbackMetrics?.avgRating ?? "N/A"}
                sub="out of 5"
                color="#f59e0b"
              />
              <StatCard
                icon={TrendingUp}
                label="Found helpful"
                value={
                  feedbackMetrics ? `${feedbackMetrics.helpfulCount}` : "—"
                }
                sub={`of ${feedbacks.length}`}
                color="#10b981"
              />
              <StatCard
                icon={MousePointer}
                label="Top feature"
                value={feedbackMetrics?.topFeatures?.[0]?.[0] ?? "—"}
                color="#06b6d4"
              />
            </div>

            {/* Feature requests */}
            {(feedbackMetrics?.requestedFeatures ?? []).length > 0 && (
              <div
                className="p-5 rounded-2xl mb-4"
                style={{ background: "#1a1d27", border: "1px solid #2a2d3a" }}
              >
                <p className="text-sm font-semibold mb-3">Requested features</p>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {feedbackMetrics?.requestedFeatures.map((f, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-xs" style={{ color: "#4f46e5" }}>
                        💡
                      </span>
                      <span className="text-xs" style={{ color: "#d1d5db" }}>
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback list */}
            {feedbacks.length === 0 ? (
              <div
                className="p-6 text-center rounded-2xl"
                style={{ background: "#1a1d27", border: "1px solid #2a2d3a" }}
              >
                <p className="text-sm" style={{ color: "#4b5563" }}>
                  No feedback submitted yet
                </p>
              </div>
            ) : (
              <div
                className="p-5 rounded-2xl space-y-3"
                style={{ background: "#1a1d27", border: "1px solid #2a2d3a" }}
              >
                <p className="text-sm font-semibold">
                  All feedback ({feedbacks.length})
                </p>
                <div className="space-y-2 max-h-[480px] overflow-y-auto">
                  {feedbacks.map((fb) => (
                    <FeedbackCard key={fb.id} fb={fb} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page entry ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    if (saved) setToken(saved);
  }, []);

  const handleLogin = (t: string) => setToken(t);
  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    setToken(null);
  };

  if (!token) return <LoginScreen onLogin={handleLogin} />;
  return <AdminDashboard token={token} onLogout={handleLogout} />;
}
