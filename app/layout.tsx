import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StatsProvider } from "@/context/context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "quizpull.ai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div
          className="relative w-full flex items-center justify-center px-10 py-2.5"
          
        >
          <div
            className="shimmer absolute inset-0 pointer-events-none"
          />
          <span className="relative flex items-center gap-2 text-[11px] md:text-xs text-neutral-300 tracking-wide font-medium">
            <span
              className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest"
              style={{
                background: "rgba(251,191,36,0.1)",
                border: "1px solid rgba(251,191,36,0.2)",
                color: "#fbbf24",
              }}
            >
              Beta
            </span>
            <a  href="#faq"
              className="underline underline-offset-2 text-neutral-400 hover:text-white transition-colors">
              Text-based PDFs only — scanned &amp; image PDFs not yet supported.
            

              
            </a>
            
          </span>
        </div>
        <StatsProvider>{children}</StatsProvider>
      </body>
    </html>
  );
}

