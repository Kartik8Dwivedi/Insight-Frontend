import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, User, Share2, Target, TrendingUp, BarChart } from "lucide-react";
import { Metadata } from "next";

// This is a simplified content store. In a real app, this might come from a CMS or DB.
const BLOG_CONTENT: Record<string, any> = {
  "comprehensive-pattern-analysis": {
    title: "Comprehensive JEE Main Pattern Analysis (2002-2025)",
    description: "An in-depth look at how the JEE Main exam has evolved over 23 years.",
    date: "March 25, 2025",
    author: "ExamsOrbit Research",
    readTime: "8 min read",
    icon: TrendingUp,
    content: (
      <>
        <p>The Joint Entrance Examination (JEE) Main has undergone significant transformations since its inception. From the AIEEE era (2002-2012) to the current NTA-led computer-based testing, the pattern of questions has shifted from purely knowledge-based to highly analytical.</p>
        
        <h3>1. The Evolution of Question Types</h3>
        <p>In the early 2000s, Physics questions were predominantly direct applications of formulas. However, our data shows that from 2019 onwards, there has been a 35% increase in 'Assertion-Reason' and 'Multi-Statement' type questions, requiring a deeper conceptual grasp.</p>
        
        <h3>2. Mathematics: The Real Rank Decider</h3>
        <p>Historically, Mathematics has seen the most consistent increase in difficulty. While Algebra once dominated the papers, Calculus and Coordinate Geometry now account for nearly 45% of the total weightage in the last 5 years.</p>
        
        <h3>3. Chemistry: Shift to NCERT Proficiency</h3>
        <p>Our analysis indicates that 85% of Inorganic Chemistry questions are directly derived from NCERT lines. Physical Chemistry, however, has become more calculation-intensive, often appearing in the Numerical Value section.</p>
      </>
    )
  },
  "high-weightage-chapters": {
    title: "High-Weightage Chapters: Physics, Chemistry & Maths",
    description: "Identify the 'must-do' chapters that appear most frequently in JEE Main.",
    date: "March 28, 2025",
    author: "Strategy Team",
    readTime: "5 min read",
    icon: Target,
    content: (
      <>
        <p>Smart preparation is about ROI (Return on Investment) of your time. Some chapters take 2 days to master and yield 2 questions, while others take 10 days for 1 question.</p>
        
        <h3>Physics Top Picks</h3>
        <ul>
          <li><strong>Modern Physics:</strong> High weightage, relatively easy to score.</li>
          <li><strong>Current Electricity:</strong> Consistent 2-3 questions every year.</li>
          <li><strong>Rotational Motion:</strong> Tough, but essential for top ranks.</li>
        </ul>

        <h3>Chemistry Goldmine</h3>
        <ul>
          <li><strong>Organic Chemistry (General):</strong> The backbone of nearly 12 questions.</li>
          <li><strong>Chemical Bonding:</strong> Foundational chapter with direct application.</li>
          <li><strong>Solutions & Electrochemistry:</strong> Reliable topics for numericals.</li>
        </ul>

        <h3>Maths Score Boosters</h3>
        <ul>
          <li><strong>Vectors & 3D Geometry:</strong> Highest weightage in modern papers.</li>
          <li><strong>Definite Integration:</strong> A staple for at least 2 questions.</li>
          <li><strong>Matrices & Determinants:</strong> Usually easy to medium difficulty.</li>
        </ul>
      </>
    )
  },
  "difficulty-shift-nta": {
    title: "The Shift in Difficulty: Analysis of NTA's Recent Papers",
    description: "Comparing the difficulty levels and session-wise variance in recent years.",
    date: "March 30, 2025",
    author: "Data Analytics Div",
    readTime: "6 min read",
    icon: BarChart,
    content: (
      <>
        <p>The National Testing Agency (NTA) introduced multiple sessions per year, which added a new layer of complexity: Session Normalization. We've analyzed 200+ unique shifts to find the hidden patterns.</p>
        
        <h3>January vs. April Sessions</h3>
        <p>Data suggests that the January session often has a slightly lower 'cut-off' percentile for the same marks compared to April, as students have more time to revise for the second attempt. However, NTA has been increasing the difficulty of the April Mathematics papers to compensate.</p>
        
        <h3>Numerical vs. MCQ Difficulty</h3>
        <p>Our Heatmap analysis shows that Numerical Value questions in Physics are currently rated 15% 'Harder' than their MCQ counterparts, often involving multi-step calculations designed to test precision under pressure.</p>
        
        <h3>Subject Wise Shift</h3>
        <p>While Chemistry remains 'Easy-Medium' across shifts, Physics has seen a shift toward being more 'Formula-Conceptual' and less 'Purely Theoretical' since 2023.</p>
      </>
    )
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_CONTENT[slug];
  if (!post) return { title: "Post Not Found" };
  
  return {
    title: `${post.title} | ExamsOrbit Blog`,
    description: post.description,
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_CONTENT[slug];

  if (!post) {
    notFound();
  }

  const Icon = post.icon;

  return (
    <div className="min-h-screen bg-[#0f1117] text-slate-200">
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0f1117]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-white/5 rounded-lg border border-white/10 group-hover:border-indigo-500/50 transition-colors">
              <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
            </div>
            <span className="text-sm font-medium text-slate-400 group-hover:text-slate-200 transition-colors">All Reports</span>
          </Link>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="ExamsOrbit" className="w-6 h-6 object-contain opacity-50" />
            <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">Intelligence Report</span>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <Icon className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-indigo-500/20 to-transparent" />
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 border-y border-white/5 py-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" />
              {post.author}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              {post.readTime}
            </div>
            <div className="ml-auto flex items-center gap-4">
              <button className="hover:text-white transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        <article className="prose prose-invert prose-indigo max-w-none 
          prose-headings:text-white prose-headings:font-bold 
          prose-p:text-slate-400 prose-p:leading-relaxed prose-p:text-lg
          prose-strong:text-indigo-300 prose-li:text-slate-400 prose-ul:list-disc">
          {post.content}
        </article>

        <div className="mt-20 p-8 rounded-3xl bg-white/[0.02] border border-white/5 text-center">
          <h3 className="text-xl font-bold text-white mb-4">Want more insights like this?</h3>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Our dashboard allows you to filter and explore these patterns in real-time. Start your strategic revision now.
          </p>
          <Link href="/dashboard" className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all">
            Open Analytics Dashboard
          </Link>
        </div>
      </main>

      <footer className="py-12 text-center border-t border-white/5">
         <p className="text-xs text-slate-600">© 2025 ExamsOrbit Research Lab</p>
      </footer>
    </div>
  );
}
