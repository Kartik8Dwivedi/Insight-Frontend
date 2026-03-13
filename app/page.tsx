"use client";

import Link from "next/link";
import styles from "./home.module.css";

/* ─── SVG Icons ─── */

const ArrowIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const CheckIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ─── Navbar ─── */

function Navbar() {
  return (
    <nav className={styles.nav}>
      <Link href="#" className={styles.navLogo}>
        <span className={styles.navLogoIcon}>E</span> ExamIntel
      </Link>
      <Link href="/dashboard" className={styles.navCta}>
        Open JEE Dashboard →
      </Link>
    </nav>
  );
}

/* ─── Hero Section ─── */

function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBadge}>JEE Dashboard is Live Now</div>
      <h1 className={styles.heroTitle}>
        Decode JEE with{" "}
        <em className={styles.heroTitleAccent}>Data Intelligence</em>
      </h1>
      <p className={styles.heroSub}>
        Stop guessing. Analyze 10 years of question papers, identify high-ROI
        topics, and build a strategy grounded in real data.
      </p>
      <div className={styles.heroActions}>
        <Link href="/dashboard" className={styles.btnPrimary}>
          Explore JEE Dashboard
          <ArrowIcon />
        </Link>
        <Link href="#how-it-works" className={styles.btnSecondary}>
          How it works
        </Link>
      </div>
      <TrustBar />
    </section>
  );
}

/* ─── Trust Bar ─── */

const trustItems = ["Free to use", "2018–2024 data", "No signup needed"];

function TrustBar() {
  return (
    <div className={styles.trustBar}>
      {trustItems.map((item, i) => (
        <span key={item} style={{ display: "contents" }}>
          {i > 0 && <div className={styles.trustDivider} />}
          <div className={styles.trustItem}>
            <CheckIcon />
            {item}
          </div>
        </span>
      ))}
    </div>
  );
}

/* ─── Dashboard Preview ─── */

function DashboardPreview() {
  const barHeights = ["30%", "55%", "70%", "100%", "80%", "60%", "45%", "35%"];

  return (
    <div className={styles.previewWrap}>
      <div className={styles.previewCard}>
        <div className={styles.previewTopbar}>
          <div className={`${styles.dot} ${styles.dotR}`} />
          <div className={`${styles.dot} ${styles.dotY}`} />
          <div className={`${styles.dot} ${styles.dotG}`} />
          <div className={styles.previewUrl}>examintel.in/jee-dashboard</div>
        </div>
        <div className={styles.previewBody}>
          {/* Bar Chart Card */}
          <div className={styles.miniChartCard}>
            <div className={styles.miniChartLabel}>Chapter Weightage</div>
            <div className={styles.barChart}>
              {barHeights.map((h, i) => (
                <div
                  key={i}
                  className={`${styles.bar} ${i === 3 ? styles.barActive : ""}`}
                  style={{ height: h }}
                />
              ))}
            </div>
          </div>

          {/* Donut Chart Card */}
          <div className={styles.miniChartCard}>
            <div className={styles.miniChartLabel}>
              Difficulty Trend 2018–2024
            </div>
            <div className={styles.donutWrap}>
              <div className={styles.donut} />
              <div className={styles.legend}>
                <div className={styles.legendItem}>
                  <div
                    className={styles.legendDot}
                    style={{ background: "var(--accent)" }}
                  />
                  Physics 38%
                </div>
                <div className={styles.legendItem}>
                  <div
                    className={styles.legendDot}
                    style={{ background: "var(--green)" }}
                  />
                  Chemistry 27%
                </div>
                <div className={styles.legendItem}>
                  <div
                    className={styles.legendDot}
                    style={{ background: "var(--gold)" }}
                  />
                  Math 20%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Stats Row ─── */

const statsData = [
  { num: "7+", label: "Years of JEE Data" },
  { num: "3K+", label: "Questions Analyzed" },
  { num: "100%", label: "Data-Driven Insights" },
  { num: "Free", label: "No Signup Required" },
];

function StatsRow() {
  return (
    <div className={styles.statsRow}>
      {statsData.map((stat) => (
        <div key={stat.label} className={styles.statCard}>
          <span className={styles.statNum}>{stat.num}</span>
          <div className={styles.statLabel}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── Features Section ─── */

const featuresData = [
  {
    icon: "📊",
    title: "Chapter Weightage Analysis",
    desc: "See exactly which chapters have appeared most across sessions — allocate time where it actually matters.",
  },
  {
    icon: "🎯",
    title: "High-ROI Topics",
    desc: "Our analysis surfaces topics with maximum marks potential and minimum study effort needed.",
  },
  {
    icon: "📈",
    title: "Difficulty & Pattern Trends",
    desc: "Understand how difficulty has evolved year over year and calibrate your prep to match the exam's actual trajectory.",
  },
  {
    icon: "🔍",
    title: "Previous Year Deep Dive",
    desc: "Every question from 2018–2024 categorized and tagged — see the exact patterns, shifts, and recurring themes.",
  },
];

function FeaturesSection() {
  return (
    <section
      className={`${styles.section} ${styles.sectionCenter}`}
      id="how-it-works"
    >
      <div className={styles.sectionTag}>What you get</div>
      <h2 className={styles.sectionTitle}>Prepare Smarter, Not Harder</h2>
      <p className={styles.sectionSub}>
        Data replaces guesswork. Clarity replaces anxiety.
      </p>
      <div className={styles.featuresGrid}>
        {featuresData.map((feature) => (
          <div key={feature.title} className={styles.featureCard}>
            <div className={styles.featureIcon}>{feature.icon}</div>
            <div className={styles.featureTitle}>{feature.title}</div>
            <div className={styles.featureDesc}>{feature.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Exam Dashboard Cards ─── */

interface ExamCardData {
  icon: string;
  iconClass: string;
  name: string;
  desc: string;
  live: boolean;
}

const examsData: ExamCardData[] = [
  {
    icon: "📐",
    iconClass: styles.examIconJee,
    name: "JEE Exam Intelligence",
    desc: "Chapter weightage · Difficulty distribution · Topic trends · 2018–2024",
    live: true,
  },
  {
    icon: "🏥",
    iconClass: styles.examIconNeet,
    name: "NEET Exam Intelligence",
    desc: "Subject-wise weightage · Topic importance · Question trends",
    live: false,
  },
  {
    icon: "📋",
    iconClass: styles.examIconCat,
    name: "CAT Exam Intelligence",
    desc: "Section patterns · High-frequency types · Difficulty shifts",
    live: false,
  },
];

function ExamCard({ exam }: { exam: ExamCardData }) {
  const cardClasses = `${styles.examCard} ${exam.live ? styles.examCardLive : ""}`;

  const content = (
    <>
      <div className={styles.examCardLeft}>
        <div className={`${styles.examIcon} ${exam.iconClass}`}>
          {exam.icon}
        </div>
        <div>
          <div className={styles.examName}>{exam.name}</div>
          <div className={styles.examDesc}>{exam.desc}</div>
        </div>
      </div>
      {exam.live ? (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span className={`${styles.badge} ${styles.badgeLive}`}>● Live</span>
          <div className={styles.examArrow}>
            <ArrowIcon />
          </div>
        </div>
      ) : (
        <span className={`${styles.badge} ${styles.badgeSoon}`}>
          Coming Soon
        </span>
      )}
    </>
  );

  if (exam.live) {
    return (
      <Link href="#" className={cardClasses}>
        {content}
      </Link>
    );
  }

  return <div className={cardClasses}>{content}</div>;
}

function ExamDashboards() {
  return (
    <section className={styles.section} id="jee-dashboard">
      <div className={styles.sectionCenter}>
        <div className={styles.sectionTag}>Dashboards</div>
        <h2 className={styles.sectionTitle}>Choose Your Exam</h2>
        <p className={styles.sectionSub}>
          Select your target exam and start preparing with clarity.
        </p>
      </div>
      <div className={styles.examCards} style={{ marginTop: "40px" }}>
        {examsData.map((exam) => (
          <ExamCard key={exam.name} exam={exam} />
        ))}
      </div>
    </section>
  );
}

/* ─── Why Data-Driven Section ─── */

const whyData = [
  {
    title: "Stop guessing what to study",
    desc: "Let the actual question data tell you where to focus your effort.",
  },
  {
    title: "Focus on chapters that appear",
    desc: "Not every chapter is equal — our data shows you which ones actually matter.",
  },
  {
    title: "Understand year-over-year patterns",
    desc: "Spot trends before they happen, stay one step ahead of the exam.",
  },
  {
    title: "Build a real strategy, not assumptions",
    desc: "Every preparation decision backed by real exam data from official papers.",
  },
];

function WhySection() {
  return (
    <section
      className={`${styles.section} ${styles.sectionCenter}`}
      style={{ paddingTop: 0 }}
    >
      <div className={styles.sectionTag}>Why data-driven?</div>
      <h2 className={styles.sectionTitle}>Competitive Exams Are Predictable</h2>
      <p className={styles.sectionSub}>
        If you know where to look. Our dashboards distill years of exam data
        into actionable clarity.
      </p>
      <div className={styles.whyGrid}>
        {whyData.map((item) => (
          <div key={item.title} className={styles.whyItem}>
            <div className={styles.whyCheck}>✓</div>
            <div>
              <strong className={styles.whyTextStrong}>{item.title}</strong>
              <span className={styles.whyTextSpan}>{item.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Coming Soon Section ─── */

const roadmapExams = [
  { icon: "🏥", name: "NEET" },
  { icon: "📋", name: "CAT" },
  { icon: "⚙️", name: "GATE" },
  { icon: "🏛️", name: "UPSC" },
];

function ComingSoonSection() {
  return (
    <section
      className={`${styles.section} ${styles.sectionCenter}`}
      style={{ paddingTop: 0 }}
    >
      <div className={styles.sectionTag}>Roadmap</div>
      <h2 className={styles.sectionTitle}>More Exams Coming</h2>
      <p className={styles.sectionSub}>
        We&apos;re building intelligence dashboards for every major competitive
        exam in India.
      </p>
      <div className={styles.comingGrid}>
        {roadmapExams.map((exam) => (
          <div key={exam.name} className={styles.comingCard}>
            <div className={styles.comingIcon}>{exam.icon}</div>
            <div className={styles.comingName}>{exam.name}</div>
            <span className={styles.comingBadge}>Coming Soon</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── CTA Section ─── */

function CTASection() {
  return (
    <div className={styles.ctaWrap}>
      <div className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>
          Start Your Data-Driven Prep Today
        </h2>
        <p className={styles.ctaDesc}>
          Join students who prepare with clarity, not chaos. JEE Dashboard is
          live and free.
        </p>
        <Link href="/dashboard" className={styles.btnWhite}>
          Open JEE Dashboard — It&apos;s Free
          <ArrowIcon />
        </Link>
      </div>
    </div>
  );
}

/* ─── Footer ─── */

function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        © 2024 ExamIntel · Built for JEE aspirants ·{" "}
        <Link href="#">Privacy</Link> · <Link href="#">Contact</Link>
      </p>
    </footer>
  );
}

/* ─── Floating Mobile CTA ─── */

function FloatingBar() {
  return (
    <Link href="#" className={styles.floatingBar}>
      Open JEE Dashboard — Free →
    </Link>
  );
}

/* ─── Page Component ─── */

export default function HomePage() {
  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
      <div className={styles.page}>
        <Navbar />
        <HeroSection />
        <DashboardPreview />
        <StatsRow />
        <FeaturesSection />
        <ExamDashboards />
        <WhySection />
        <ComingSoonSection />
        <CTASection />
        <Footer />
        <FloatingBar />
      </div>
    </>
  );
}
