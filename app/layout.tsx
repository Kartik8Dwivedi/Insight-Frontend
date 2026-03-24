import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import Script from "next/script";

const inter = IBM_Plex_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ExamsOrbit | JEE Main Pattern Analysis & Strategic Insights",
  description: "Master JEE Main with data-driven insights. Analyze 20+ years of paper patterns, chapter weightage, and difficulty trends to prioritize your preparation effectively.",
  keywords: ["JEE Main", "JEE Preparation", "ExamsOrbit", "JEE Analysis", "Chapter Weightage", "JEE Strategy", "JEE PYQ Analysis"],
  authors: [{ name: "ExamsOrbit Team" }],
  openGraph: {
    title: "ExamsOrbit | Decode the JEE Main Pattern",
    description: "Your ultimate data-driven companion for JEE preparation. Analysis of 15,000+ questions from 2002-2025.",
    url: "https://examsorbit.com",
    siteName: "ExamsOrbit",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "ExamsOrbit Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ExamsOrbit | JEE Main Strategic Insights",
    description: "Master the JEE Main pattern with analysis of 20+ years of data.",
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/favicon_io/apple-touch-icon.png" },
    ],
    other: [
      { rel: "manifest", url: "/favicon_io/site.webmanifest" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "w0vjnnuty6");
          `}
        </Script>
      </head>
      <body
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
