import DashboardPage from "@/components/pages/dashboard/dashboard-page";

// Simple shell — all data loading is handled client-side by useAnalyticsData hook.
// No server-side fetch needed; data comes from /api/analytics on the client.
export default function Dashboard() {
  return <DashboardPage />;
}
