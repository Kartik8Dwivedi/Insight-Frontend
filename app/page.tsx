import DashboardPage from "@/components/pages/dashboard/dashboard-page";
import { QuestionData } from "@/types";
import { getChaptersAndTopics } from "@/lib/utils";
import { Loader } from "lucide-react";
import { Suspense } from "react";
import { headers } from "next/headers";

const Homepage = async () => {
  // Determine base URL dynamically based on environment
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;
  
  try {
    const res = await fetch(`${baseUrl}/api/data`, { cache: 'no-store' });
    if (!res.ok) {
        const errorText = await res.text().catch(() => "No error body");
        throw new Error(`Frontend API failed (${res.status}): ${errorText.substring(0, 100)}`);
    }
    
    const data = await res.json();
    const filteredData = data.filteredData || [];
    const {chapters,topics} = getChaptersAndTopics(filteredData);
    
    return (
      <Suspense fallback={<Loading />}>
        <DashboardPage 
          mockData={filteredData} 
          chapters={chapters}
          topics={topics} 
        />
      </Suspense>
    );
  } catch (err: any) {
    console.error("Critical Page Error:", err.message);
    return (
      <div className="p-10 text-red-500 font-bold bg-red-50 min-h-screen">
        <h1 className="text-2xl mb-4">Dashboard Error</h1>
        <p className="font-mono text-sm bg-white p-4 border border-red-200 rounded">
          {err.message}
        </p>
        <p className="mt-4 text-gray-600 font-normal">
          Tip: Ensure the BACKEND_URL environment variable is correctly set in your Vercel project settings.
        </p>
      </div>
    );
  }
}
  
export default Homepage;

function Loading(){
  return (
    <div className="min-h-screen bg-background animate-pulse flex justify-center items-center">
      <Loader className="animate-spin" size={20} />
      <p className="text-muted-foreground font-semibold ml-2">Loading Data...</p>
    </div>
  )
}
