"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Plus,
  BarChart3,
  FileText,
  Zap,
  Clock,
  ArrowRight,
  Menu,
  X,
  Brain,
  Sparkles,
  Shield,
  CheckCircle2,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(
        ".hero-line",
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power4.out" }
      ).fromTo(
        ".hero-badge",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
        "-=1.2"
      );

      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 70%",
        },
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".stat-value", {
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
        },
        textContent: 0,
        duration: 2,
        ease: "power2.out",
        snap: { textContent: 1 },
        stagger: 0.2,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      className="min-h-screen text-[#ededed] selection:bg-white selection:text-black overflow-x-hidden"
      style={{
        background: "#050505",
        backgroundImage:
          "radial-gradient(ellipse 90% 60% at 50% -5%, rgba(139,92,246,0.18) 0%, transparent 55%)",
      }}
    >
      {/*GLOBAL GRID OVERLAY*/}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* PURPLE AMBIENT GLOWS */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)", filter: "blur(40px)" }}
      />
      <div className="fixed top-1/3 left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse, rgba(109,40,217,0.08) 0%, transparent 70%)", filter: "blur(60px)" }}
      />
      <div className="fixed top-1/2 right-[-10%] w-[400px] h-[400px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.07) 0%, transparent 70%)", filter: "blur(60px)" }}
      />

      {/*NAVBAR*/}

      <nav
        className=" top-0 w-full z-[100] "
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-5 h-5 bg-white rotate-45 group-hover:rotate-180 transition-transform duration-500" />
            <span className="font-bold tracking-tighter text-xl uppercase">
              Quizpull.ai
            </span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <a href="#features" className="text-sm text-neutral-400 hover:text-white transition-colors">Features</a>
            <a href="#faq" className="text-sm text-neutral-400 hover:text-white transition-colors">FAQ</a>
            <div className="h-4 w-[1px] bg-white/10" />
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-white px-5 py-2.5 "
            >
              Dashboard →
            </Link>
          </div>

          <button className="md:hidden z-10" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/5 px-6 py-6 flex flex-col gap-4 bg-[#050505]">
            <a href="#features" className="text-sm text-neutral-400 hover:text-white" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#faq" className="text-sm text-neutral-400 hover:text-white" onClick={() => setIsMenuOpen(false)}>FAQ</a>
            <Link href="/dashboard" className="text-sm font-semibold text-white" onClick={() => setIsMenuOpen(false)}>Dashboard →</Link>
          </div>
        )}
      </nav>

      {/* HERO SECTION*/}
      <section ref={heroRef} className="relative z-10 pt-52 pb-32 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-[1fr,1fr] gap-16 items-center">
          <div className="space-y-8">
            {/* Green badge */}
            <div className="hero-badge inline-flex items-center gap-3 px-5 py-2 rounded-full border border-green-500/30 bg-green-500/10">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] uppercase tracking-widest font-bold text-green-400">
                Now Live — AI-Powered Quizzes
              </span>
            </div>


            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.92]">
              <div className="overflow-hidden py-1">
                <span className="hero-line inline-block">Active Recall,</span>
              </div>
              <div className="overflow-hidden py-1">
                <span className="hero-line inline-block text-neutral-500">Automated.</span>
              </div>
            </h1>

            <p className="hero-line text-xl text-neutral-400 max-w-lg leading-relaxed">
              Upload PDFs. Our neural engine parses the logic, generating spaced-repetition quizzes that adapt to your performance in real-time.
            </p>

            {/* Feature bullets */}
            <div className="hero-line flex flex-col gap-3">
              {[
                "Instant quiz generation from any PDF",
                "Spaced repetition powered by AI",
                "Performance heatmaps & analytics",
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-neutral-400">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  {feat}
                </div>
              ))}
            </div>

            <div className="hero-line flex flex-col sm:flex-row gap-4 pt-2">
              <button
                className="group h-14 px-10 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                onClick={() => router.push("/dashboard")}
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="h-14 px-10 border border-white/10 bg-white/5 font-bold rounded-2xl hover:bg-white/8 transition-all text-sm">
                See how it works
              </button>
            </div>

            {/* Avatars */}
            <div className="hero-line flex items-center gap-4 pt-2">
              <div className="flex -space-x-3">
                {["/avatars/a1.png", "/avatars/a2.png", "/avatars/a3.png", "/avatars/a4.png"].map((src, i) => (
                  <img key={i} src={src} alt="user" className="w-8 h-8 rounded-full border-2 border-[#050505] object-cover" />
                ))}
              </div>
              <span className="text-xs text-neutral-500">
                Trusted by <span className="text-white font-semibold">2,000+</span> researchers
              </span>
            </div>
          </div>

          <div className="relative hidden lg:block">
            {/* Purple glow behind card */}
            <div className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.25) 0%, transparent 70%)", filter: "blur(30px)", transform: "scale(1.1)" }}
            />

            {/*DEV QUIZ CARD*/}
            <DevQuizCard />
          </div>
        </div>
      </section>

      {/*STATS STRIP*/}
      <section ref={statsRef} className="relative z-10 border-y border-white/5"
        style={{ background: "linear-gradient(90deg, rgba(139,92,246,0.04) 0%, rgba(5,5,5,0) 50%, rgba(139,92,246,0.04) 100%)" }}
      >
        <div className="max-w-[1400px] mx-auto px-12 py-16 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: "Accuracy Rate", val: 99, unit: "%" },
            { label: "Quizzes Created", val: 5, unit: "k+" },
            { label: "Time Saved", val: 85, unit: "%" },
            { label: "User Rating", val: 4.9, unit: "/5" },
          ].map((stat, i) => (
            <div key={i} className="relative group">
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 70%)" }}
              />
              <div className="text-4xl md:text-5xl font-bold tracking-tighter mb-2">
                <span className="stat-value">{stat.val}</span>{stat.unit}
              </div>
              <div className="text-sm text-neutral-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/*BENTO FEATURES*/}
      <section ref={featuresRef} id="features" className="relative z-10 px-6 md:px-12 py-40 max-w-[1400px] mx-auto">
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-[11px] uppercase tracking-widest font-bold text-violet-400">Features</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">Engineered for depth.</h2>
          </div>
          <p className="text-neutral-500 max-w-xs text-sm leading-relaxed md:text-right">
            Every feature built to close the gap between passive reading and true mastery.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">

          {/* Feature 1 — Large left, purple glow */}
          <div className="feature-card md:col-span-7 relative rounded-[2rem] p-10 flex flex-col justify-between h-[480px] overflow-hidden group border border-white/5"
            style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.15) 0%, rgba(5,5,5,0.95) 60%)" }}
          >
            <div className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: "linear-gradient(rgba(139,92,246,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.15) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Zap className="text-violet-400 w-6 h-6" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4">Neural Extraction</h3>
              <p className="text-neutral-400 text-lg max-w-md leading-relaxed">
                Advanced OCR and context parsing that understands diagrams, formulas, and complex academic citations with near-perfect fidelity.
              </p>
            </div>
            {/* Glow orb */}
            <div className="absolute bottom-[-30%] right-[-10%] w-72 h-72 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.2) 0%, transparent 70%)", filter: "blur(30px)" }}
            />
          </div>

          {/* Feature 2 — Green card */}
          <div className="feature-card md:col-span-5 relative rounded-[2rem] p-10 flex flex-col justify-between h-[480px] overflow-hidden group border border-green-500/20"
            style={{ background: "linear-gradient(135deg, rgba(22,163,74,0.18) 0%, rgba(16,185,129,0.08) 40%, rgba(5,5,5,0.97) 100%)" }}
          >
            <div className="absolute inset-0 pointer-events-none opacity-25"
              style={{
                backgroundImage: "linear-gradient(rgba(34,197,94,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.1) 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4 tracking-tight">Performance Heatmaps</h3>
              <p className="text-green-100/50 text-lg leading-relaxed">
                Visual documentation of your cognitive load. See exactly which chapters are fading from your long-term memory.
              </p>
            </div>
            <div className="absolute bottom-[-20%] right-[-10%] w-56 h-56 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(ellipse, rgba(34,197,94,0.15) 0%, transparent 70%)", filter: "blur(30px)" }}
            />
          </div>

          {/* Feature 3 */}
          <div className="feature-card md:col-span-4 relative rounded-[2rem] p-10 flex flex-col justify-between h-[420px] overflow-hidden group border border-white/5"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div className="absolute inset-0 pointer-events-none opacity-10"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Clock className="text-neutral-400 w-6 h-6" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-3 tracking-tight">Spaced Intervals</h3>
              <p className="text-neutral-500 text-base">Automated scheduling based on the Ebbinghaus forgetting curve. Master any topic in 30% less time.</p>
            </div>
          </div>

          {/* Feature 4 — Brain */}
          <div className="feature-card md:col-span-4 relative rounded-[2rem] p-10 flex flex-col justify-between h-[420px] overflow-hidden group border border-violet-500/10"
            style={{ background: "linear-gradient(180deg, rgba(109,40,217,0.1) 0%, rgba(5,5,5,0.98) 100%)" }}
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Brain className="text-violet-400 w-6 h-6" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-3 tracking-tight">Adaptive AI</h3>
              <p className="text-neutral-500 text-base">Questions evolve based on your answers. The harder you think, the smarter it gets.</p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.15) 0%, transparent 70%)", filter: "blur(20px)" }}
            />
          </div>

          {/* Feature 5 — Export */}
          <div className="feature-card md:col-span-4 relative rounded-[2rem] p-10 flex flex-col justify-between h-[420px] overflow-hidden group border border-white/5"
            style={{ background: "rgba(255,255,255,0.01)" }}
          >
            <div className="absolute inset-0 pointer-events-none opacity-10"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize: "25px 25px",
              }}
            />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <FileText className="text-neutral-400 w-6 h-6" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-3 tracking-tight">Export Anywhere</h3>
              <p className="text-neutral-500 text-base">One-click sync to Anki, Notion, or Quizlet. Your data, formatted exactly how you like it.</p>
            </div>
          </div>

          {/* Wide CTA card */}
          <div className="feature-card md:col-span-12 relative rounded-[2rem] p-12 md:p-16 overflow-hidden border border-white/5 group"
            style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(5,5,5,0) 50%, rgba(22,163,74,0.08) 100%)" }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-violet-500/30 via-green-500/30 to-transparent" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-green-400 font-semibold">Enterprise-grade security</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Your PDFs are fully encrypted.</h3>
                <p className="text-neutral-500 max-w-lg">AES-256 encryption. Processed in secure sandboxes. Never used to train global models.</p>
              </div>
              <button
                onClick={() => router.push("/dashboard")}
                className="flex-shrink-0 h-14 px-10 bg-white text-black font-bold rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.08)]"
              >
                Start for free <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/*
          FAQ SECTION */}
      <section id="faq" className="relative z-10 px-6 md:px-12 py-40 max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 mb-6">
            <span className="text-[11px] uppercase tracking-widest font-bold text-violet-400">FAQ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Common Questions</h2>
          <p className="text-neutral-500">Everything you need to know about the platform.</p>
        </div>

        <div className="space-y-2">
          {[
            { q: "How secure are my uploaded documents?", a: "We use enterprise-grade AES-256 encryption. Your PDFs are processed in secure sandboxes and are never used to train global AI models." },
            { q: "Which languages are supported?", a: "Quizpull.ai currently supports over 45 languages, including English, Spanish, Mandarin, and Japanese, with full mathematical notation support." },
            { q: "Is there a free plan?", a: "Yes! You can get started completely free. Our free tier includes up to 5 PDF uploads per month and unlimited quizzes from those files." },
            { q: "Can I export my quizzes to Anki or Notion?", a: "Absolutely. One-click export to Anki (.apkg), Notion, Quizlet, and plain CSV is available on all plans." },
          ].map((item, i) => (
            <Accordion key={i} question={item.q} answer={item.a} />
          ))}
        </div>
      </section>

      {/*
          FINAL CTA*/}
      <section className="relative z-10 px-6 md:px-12 pb-40">
        <div className="max-w-[1400px] mx-auto relative rounded-[3rem] p-12 md:p-32 text-center overflow-hidden border border-white/5"
          style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(5,5,5,0.98) 50%, rgba(22,163,74,0.08) 100%)" }}
        >
          {/* Grid inside CTA */}
          <div className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "70px 70px",
            }}
          />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 mb-10">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] uppercase tracking-widest font-bold text-green-400">Free to start</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">
              Stop reading.<br />
              <span className="text-neutral-500">Start mastering.</span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/dashboard")}
                className="h-14 px-12 bg-white text-black font-bold rounded-2xl text-base hover:scale-105 transition-all shadow-[0_0_60px_rgba(255,255,255,0.1)]"
              >
                Get Started Now →
              </button>
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 70%)", filter: "blur(40px)" }}
          />
        </div>
      </section>

      {/*FOOTER*/}
      <footer className="relative z-10 px-6 md:px-12 py-20 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-5 h-5 bg-white rotate-45" />
              <span className="font-bold tracking-tighter text-xl">QUIZPULL.AI</span>
            </div>
            <p className="text-neutral-500 text-sm max-w-xs leading-relaxed">
              The world's most advanced AI study partner. Designed for those who demand precision and speed in their learning journey.
            </p>
          </div>
          {/* {["Product", "Company", "Legal"].map((cat) => (
            <div key={cat} className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest">{cat}</h4>
              <div className="flex flex-col gap-3">
                {["Link One", "Link Two", "Link Three"].map((l) => (
                  <Link key={l} href="#" className="text-neutral-500 hover:text-white transition-colors text-sm">{l}</Link>
                ))}
              </div>
            </div>
          ))} */}
        </div>
        <div className="max-w-[1400px] mx-auto flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-neutral-600">
          <span>© 2026 Quizpull.ai Inc.</span>
          <div className="flex gap-8">
            {/* <Link href="#" className="hover:text-white">Status</Link>
            <Link href="#" className="hover:text-white">Security</Link> */}
          </div>
        </div>
      </footer>
    </div>
  );
}

const TOPICS = [
  {
    id: "dsa",
    label: "DSA",
    color: "text-green-400",
    border: "border-green-500/40",
    bg: "bg-green-500/15",
    file: "dsa_notes.pdf",
    fileColor: "text-green-400",
    question: 'What is the time complexity of searching in a balanced BST?',
    hint: "Think about the height of the tree.",
    opts: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correct: 1,
  },
  {
    id: "ml",
    label: "ML / AI",
    color: "text-violet-400",
    border: "border-violet-500/40",
    bg: "bg-violet-500/15",
    file: "ml_fundamentals.pdf",
    fileColor: "text-violet-400",
    question: "Which activation function suffers most from the vanishing gradient problem?",
    hint: "Common in early deep networks.",
    opts: ["ReLU", "Sigmoid", "GELU", "LeakyReLU"],
    correct: 1,
  },
  {
    id: "os",
    label: "OS",
    color: "text-sky-400",
    border: "border-sky-500/40",
    bg: "bg-sky-500/15",
    file: "operating_systems.pdf",
    fileColor: "text-sky-400",
    question: "Which scheduling algorithm can cause the 'convoy effect'?",
    hint: "One long job blocks everything behind it.",
    opts: ["Round Robin", "FCFS", "SRTF", "Priority"],
    correct: 1,
  },
  {
    id: "sys",
    label: "System Design",
    color: "text-orange-400",
    border: "border-orange-500/40",
    bg: "bg-orange-500/15",
    file: "system_design.pdf",
    fileColor: "text-orange-400",
    question: "In CAP theorem, a distributed system can guarantee at most how many of the three properties simultaneously?",
    hint: "Brewer's theorem limits you to 2 of 3.",
    opts: ["All three", "Two", "Only one", "None"],
    correct: 1,
  },
];

function DevQuizCard() {
  const [activeTab, setActiveTab] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const topic = TOPICS[activeTab];

  const handleTab = (i: number) => {
    setActiveTab(i);
    setSelected(null);
  };

  return (
    <div className="relative">
      {/* Purple glow behind card */}
      <div
        className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.22) 0%, transparent 70%)",
          filter: "blur(30px)",
          transform: "scale(1.1)",
        }}
      />

      {/* Card */}
      <div
        className="relative rounded-[2.5rem] overflow-hidden border border-green-500/15"
        style={{
          background:
            "linear-gradient(135deg, rgba(22,163,74,0.12) 0%, rgba(16,185,129,0.05) 30%, rgba(5,5,5,0.96) 100%)",
        }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,197,94,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.07) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/35 to-transparent" />

        <div className="relative z-10 p-8 space-y-5">

          {/* ── Window chrome ── */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-green-400/60 font-bold">
              Quiz Preview
            </span>
          </div>

          {/* ── Topic tabs ── */}
          <div className="flex gap-2 flex-wrap">
            {TOPICS.map((t, i) => (
              <button
                key={t.id}
                onClick={() => handleTab(i)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide border transition-all ${i === activeTab
                  ? `${t.bg} ${t.border} ${t.color}`
                  : "bg-white/[0.03] border-white/5 text-neutral-500 hover:border-white/10 hover:text-neutral-300"
                  }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── File pill ── */}
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/5 bg-white/[0.04]">
            <FileText className={`w-4 h-4 flex-shrink-0 ${topic.fileColor}`} />
            <span className="text-sm text-neutral-300 truncate">{topic.file}</span>
            <span className={`ml-auto text-[10px] font-bold uppercase tracking-wide flex-shrink-0 ${topic.fileColor}`}>
              ✓ Processed
            </span>
          </div>

          {/* ── Question ── */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border ${topic.border} ${topic.bg}`}
              >
                <span className={`text-[10px] font-bold ${topic.color}`}>Q</span>
              </div>
              <p className="text-sm text-neutral-200 leading-relaxed">{topic.question}</p>
            </div>

            {/* Hint chip */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 w-fit">
              <span className="text-[10px] text-neutral-500">💡</span>
              <span className="text-[11px] text-neutral-500 italic">{topic.hint}</span>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {topic.opts.map((opt, i) => {
                const isCorrect = i === topic.correct;
                const isSelected = selected === i;
                const revealed = selected !== null;

                let cls =
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm cursor-pointer transition-all border ";
                if (revealed && isCorrect)
                  cls += `${topic.bg} ${topic.border} ${topic.color}`;
                else if (revealed && isSelected && !isCorrect)
                  cls += "bg-red-500/10 border-red-500/30 text-red-400";
                else if (!revealed && isSelected)
                  cls += `${topic.bg} ${topic.border} ${topic.color}`;
                else
                  cls +=
                    "bg-white/[0.03] border-white/5 text-neutral-400 hover:border-white/10 hover:text-neutral-300";

                return (
                  <div key={i} className={cls} onClick={() => setSelected(i)}>
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${revealed && isCorrect ? topic.border + " " + topic.color : "border-current"
                        }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="font-mono text-[13px]">{opt}</span>
                    {revealed && isCorrect && (
                      <CheckCircle2 className={`w-4 h-4 ml-auto flex-shrink-0 ${topic.color}`} />
                    )}
                    {revealed && isSelected && !isCorrect && (
                      <span className="ml-auto text-[11px] text-red-400 flex-shrink-0">✕ Wrong</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Reveal hint */}
            {selected === null && (
              <p className="text-[11px] text-neutral-600 text-center pt-1">
                Click an option to check your answer
              </p>
            )}
            {selected !== null && selected !== topic.correct && (
              <p className={`text-[11px] ${topic.color} text-center pt-1 font-semibold`}>
                Correct answer: {String.fromCharCode(65 + topic.correct)} — {topic.opts[topic.correct]}
              </p>
            )}
            {selected === topic.correct && (
              <p className={`text-[11px] ${topic.color} text-center pt-1 font-semibold`}>
                🎉 Correct! Well done.
              </p>
            )}
          </div>

          {/* ── Progress ── */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-neutral-500">
              <span>Progress</span>
              <span className={`font-semibold ${topic.color}`}>7 / 10</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/5">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: "70%",
                  background:
                    activeTab === 0
                      ? "linear-gradient(90deg,#22c55e,#10b981)"
                      : activeTab === 1
                        ? "linear-gradient(90deg,#8b5cf6,#6366f1)"
                        : activeTab === 2
                          ? "linear-gradient(90deg,#38bdf8,#0ea5e9)"
                          : "linear-gradient(90deg,#f97316,#fb923c)",
                }}
              />
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Accuracy", val: "94%", color: topic.color },
              { label: "Streak", val: "12d", color: "text-violet-400" },
              { label: "Time", val: "3:20", color: "text-neutral-300" },
            ].map((s, i) => (
              <div key={i} className="text-center px-3 py-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div className={`text-lg font-bold ${s.color}`}>{s.val}</div>
                <div className="text-[10px] text-neutral-600 uppercase tracking-wide mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Accordion({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        height: isOpen ? "auto" : 0,
        opacity: isOpen ? 1 : 0,
        duration: 0.5,
        ease: "power3.inOut",
      });
    }
  }, [isOpen]);

  return (
    <div className="border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors"
      style={{ background: "rgba(255,255,255,0.01)" }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 flex justify-between items-center text-left group"
      >
        <span className="text-lg font-semibold tracking-tight group-hover:text-white transition-colors">{question}</span>
        <div className={`p-2 rounded-full border border-white/10 transition-transform duration-500 flex-shrink-0 ml-4 ${isOpen ? "rotate-45 border-violet-500/40 bg-violet-500/10" : ""}`}>
          <Plus className="w-4 h-4" />
        </div>
      </button>
      <div ref={contentRef} className="h-0 opacity-0 overflow-hidden">
        <div className="px-8 pb-6 text-neutral-500 text-base leading-relaxed max-w-2xl">{answer}</div>
      </div>
    </div>
  );
}