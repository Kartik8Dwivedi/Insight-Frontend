import Link from "next/link";
import { ArrowLeft, BookOpen, TrendingUp, Target, BarChart, ChevronRight } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JEE Main Pattern Analysis Blog | ExamsOrbit Insights",
  description: "Deep dive into 20+ years of JEE Main paper patterns. Discover chapter weightage, difficulty trends, and strategic preparation insights for JEE 2025/2026.",
  keywords: ["JEE Main Analysis", "Chapter Weightage JEE", "JEE Difficulty Trends", "ExamsOrbit Blog", "JEE Preparation Strategy"],
};

export default function BlogPage() {
  const posts = [
    {
      title: "Comprehensive JEE Main Pattern Analysis (2002-2025)",
      slug: "comprehensive-pattern-analysis",
      description: "How the JEE Main exam has evolved over two decades and what it means for your 2025 preparation.",
      icon: TrendingUp,
      tag: "Deep Dive",
      readTime: "8 min read"
    },
    {
      title: "High-Weightage Chapters: Physics, Chemistry & Maths",
      slug: "high-weightage-chapters",
      description: "A data-backed list of chapters that contribute to 60% of the total JEE Main marks.",
      icon: Target,
      tag: "Strategy",
      readTime: "5 min read"
    },
    {
      title: "The Shift in Difficulty: Analysis of NTA's Recent Papers",
      slug: "difficulty-shift-nta",
      description: "Comparing the difficulty levels of the January vs April sessions in the last 3 years.",
      icon: BarChart,
      tag: "Data Analysis",
      readTime: "6 min read"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f1117] text-slate-200 selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0f1117]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-white/5 rounded-lg border border-white/10 group-hover:border-indigo-500/50 transition-colors">
              <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
            </div>
            <span className="text-sm font-medium text-slate-400 group-hover:text-slate-200 transition-colors">Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center p-1 shadow-lg shadow-indigo-500/20">
               <img src="/logo.png" alt="ExamsOrbit" className="w-full h-full object-contain rounded-md" />
            </div>
            <span className="font-bold tracking-tight text-white">ExamsOrbit <span className="text-indigo-400">Blog</span></span>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            JEE Intelligence <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Reports</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            We analyze millions of data points from 20+ years of JEE Main papers to help you study smarter, not harder. Our insights are driven by data, not guesswork.
          </p>
        </header>

        {/* Featured Posts Grid */}
        <div className="grid md:grid-cols-1 gap-6 mb-20">
          {posts.map((post, i) => (
            <article key={i} className="group relative p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                  <post.icon className="w-8 h-8 text-indigo-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                      {post.tag}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{post.readTime}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-slate-400 leading-relaxed mb-6 max-w-2xl">
                    {post.description}
                  </p>
                  <Link href={`/blog/${post.slug}`} className="flex items-center gap-2 text-sm font-bold text-indigo-400 group/btn">
                    Read Analysis
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* SEO Analysis Content Block */}
        <section className="prose prose-invert prose-indigo max-w-none border-t border-white/5 pt-16">
          <h2 className="text-3xl font-bold text-white mb-8">Why ExamsOrbit is the Best Tool for JEE Aspirants</h2>
          <div className="grid md:grid-cols-2 gap-12 text-slate-400 leading-relaxed">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-200">The Power of Historical Data</h3>
              <p>
                In the highly competitive world of JEE Main, preparation without data is like sailing without a compass. Our engine processes over 15,000+ questions from 2002 to 2025. This allows us to identify <strong>consistent paper patterns</strong> that other tools miss.
              </p>
              <p>
                For example, our analysis shows that <strong>Modern Physics</strong> and <strong>Coordinate Geometry</strong> have consistently maintained a high weightage regardless of the shifting conducting bodies (from CBSE to NTA).
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-200">Strategic Preparation Strategy</h3>
              <p>
                We don't just show you what was asked; we show you <strong>how</strong> it was asked. Is a chapter mostly conceptual or calculation-heavy? Our <strong>Difficulty Heatmaps</strong> categorize questions into Easy, Medium, and Hard, helping students prioritize their practice based on their current level.
              </p>
              <p>
                Using our AI Search, students can instantly find trends for specific topics, saving hundreds of hours of manual research through bulky PYQ books.
              </p>
            </div>
          </div>

          <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-indigo-600/20 to-cyan-600/10 border border-indigo-500/20 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Start Your Data-Driven JEE Journey Today</h3>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are using ExamsOrbit to decode the JEE Main pattern and improve their strategic rank.
            </p>
            <Link href="/dashboard" className="inline-flex items-center justify-center px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5">
              Launch Intelligence Dashboard
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 bg-white/[0.01]">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
             <img src="/logo.png" alt="ExamsOrbit" className="w-8 h-8 grayscale opacity-50" />
             <p className="text-xs text-slate-500">© 2025 ExamsOrbit. Built for the next generation of engineers.</p>
          </div>
          <div className="flex gap-6">
            <Link href="/sitemap.xml" className="text-xs text-slate-500 hover:text-indigo-400">Sitemap</Link>
            <Link href="/robots.txt" className="text-xs text-slate-500 hover:text-indigo-400">Robots</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
