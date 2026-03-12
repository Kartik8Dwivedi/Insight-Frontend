import DashboardPage from "@/components/pages/dashboard/dashboard-page";
import { QuestionData } from "@/data/mockData";
import { getChaptersAndTopics } from "@/lib/utils";
import { Loader } from "lucide-react";
import { Suspense } from "react";

const Homepage = async () => {
  // Always hit the local Next.js API route (Port 3000)
  const baseUrl = "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/data`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Frontend API failed with status ${res.status}`);
    
    const data = await res.json();
    const filteredData = data.filteredData || [];
    const {chapters,topics} = getChaptersAndTopics(filteredData);
    
    return <Suspense fallback={<Loading />}>
      <DashboardPage 
        mockData={filteredData} 
        chapters={chapters}
        topics={topics} />
    </Suspense> 
  } catch (err: any) {
    console.error("Critical Page Error:", err.message);
    return <div className="p-10 text-red-500 font-bold">Error loading Dashboard: {err.message}</div>
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
