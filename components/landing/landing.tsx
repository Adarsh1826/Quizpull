"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
    Plus,
    BarChart3,
    FileText,
    Zap,
    Clock,
    CheckCircle2,
    ArrowRight,
    Menu,
    X
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
    const previewRef = useRef(null);
    const featuresRef = useRef(null);
    const statsRef = useRef(null);

    const router = useRouter()

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero Entrance
            const tl = gsap.timeline();
            tl.fromTo(".hero-line",
                { y: 100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power4.out" }
            )
                .fromTo(".hero-preview",
                    { scale: 0.9, opacity: 0, rotateX: -15, y: 100 },
                    { scale: 1, opacity: 1, rotateX: 0, y: 0, duration: 1.5, ease: "power3.out" },
                    "-=0.8"
                );

            // Feature Stagger
            gsap.from(".feature-card", {
                scrollTrigger: {
                    trigger: featuresRef.current,
                    start: "top 70%",
                },
                y: 60,
                opacity: 0,
                stagger: 0.2,
                duration: 1,
                ease: "power3.out"
            });

            // Stats Counting Effect
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
        <div className="min-h-screen bg-[#000] text-[#ededed] selection:bg-white selection:text-black">

            {/* NAVBAR */}
            <nav className="fixed top-0 w-full z-[100] border-b border-white/5 backdrop-blur-xl bg-black/50">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <div className="w-5 h-5 bg-white rotate-45 group-hover:rotate-180 transition-transform duration-500" />
                        <span className="font-bold tracking-tighter text-xl uppercase">Quizpull.ai</span>
                    </div>

                    <div className="hidden md:flex items-center gap-10">

                        <div className="h-4 w-[1px] bg-white/10" />
                        <Link href="/auth/login" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Log in</Link>

                    </div>

                    <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section ref={heroRef} className="pt-44 pb-32 px-6 md:px-12 max-w-[1400px] mx-auto overflow-hidden">
                <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-20 items-start">

                    <div className="space-y-10">
                        <div className="hero-line inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-white/5">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => <div key={i} className="w-5 h-5 rounded-full border-2 border-black bg-green-400" />)}
                            </div>
                            <span className="text-[11px] uppercase tracking-widest font-semibold text-neutral-400 italic">Used by 2k+ Researchers</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.95] mb-8">
                            <div className="overflow-hidden py-1"><span className="hero-line inline-block">Active Recall,</span></div>
                            <div className="overflow-hidden py-1"><span className="hero-line inline-block text-neutral-500">Automated.</span></div>
                        </h1>

                        <p className="hero-line text-xl text-neutral-400 max-w-lg leading-relaxed">
                            Upload PDFs. Our neural engine parses the logic, generating spaced-repetition quizzes that adapt to your performance in real-time.
                        </p>

                        <div className="hero-line flex flex-col sm:flex-row gap-5 pt-4">
                            <button className="group h-16 px-10 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all"
                                onClick={()=>{
                                    router.push("/dashboard")
                                }}
                            >
                                Get Started for Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="h-16 px-10 border border-white/10 bg-white/5 font-bold rounded-2xl hover:bg-white/10 transition-all">
                                Watch Methodology
                            </button>
                        </div>
                    </div>

                    {/* INTERACTIVE MOCKUP */}

                </div>
            </section>

            {/* STATS STRIP */}
            <section ref={statsRef} className="border-y border-white/5 bg-white/[0.01]">
                <div className="max-w-[1400px] mx-auto px-12 py-20 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    {[
                        { label: "Accuracy Rate", val: 99, unit: "%" },
                        { label: "Quizzes Created", val: 5, unit: "k+" },
                        { label: "Time Saved", val: 85, unit: "%" },
                        { label: "User Rating", val: 4.9, unit: "/5" }
                    ].map((stat, i) => (
                        <div key={i}>
                            <div className="text-4xl md:text-5xl font-bold tracking-tighter mb-2">
                                <span className="stat-value">{stat.val}</span>{stat.unit}
                            </div>
                            <div className="text-sm text-neutral-500 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* BENTO FEATURES */}
            <section ref={featuresRef} id="features" className="px-6 md:px-12 py-40 max-w-[1400px] mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold mb-20 tracking-tighter text-center md:text-left">Engineered for depth.</h2>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="feature-card md:col-span-7 bg-neutral-900/40 border border-white/5 rounded-[2rem] p-12 flex flex-col justify-between group h-[500px]">
                        <Zap className="text-white w-12 h-12 mb-8 group-hover:scale-110 transition-transform" />
                        <div>
                            <h3 className="text-3xl font-bold mb-4">Neural Extraction</h3>
                            <p className="text-neutral-400 text-lg max-w-md leading-relaxed">
                                Advanced OCR and context parsing that understands diagrams, formulas, and complex academic citations with near-perfect fidelity.
                            </p>
                        </div>
                    </div>

                    <div className="feature-card md:col-span-5 bg-white text-black rounded-[2rem] p-12 flex flex-col justify-between h-[500px]">
                        <BarChart3 className="w-12 h-12" />
                        <div>
                            <h3 className="text-3xl font-bold mb-4 tracking-tight">Performance Heatmaps</h3>
                            <p className="text-neutral-600 text-lg leading-relaxed">
                                Visual documentation of your cognitive load. See exactly which chapters are fading from your long-term memory.
                            </p>
                        </div>
                    </div>

                    <div className="feature-card md:col-span-5 bg-neutral-900 border border-white/5 rounded-[2rem] p-12 flex flex-col justify-between h-[450px]">
                        <Clock className="text-neutral-500 w-12 h-12" />
                        <div>
                            <h3 className="text-3xl font-bold mb-4 tracking-tight">Spaced Intervals</h3>
                            <p className="text-neutral-500 text-lg">Automated scheduling based on the Ebbinghaus forgetting curve. Master any topic in 30% less time.</p>
                        </div>
                    </div>

                    <div className="feature-card md:col-span-7 bg-neutral-900/40 border border-white/5 rounded-[2rem] p-12 flex flex-col justify-between h-[450px] relative overflow-hidden">
                        <FileText className="text-neutral-500 w-12 h-12" />
                        <div className="z-10">
                            <h3 className="text-3xl font-bold mb-4 tracking-tight">Export Anywhere</h3>
                            <p className="text-neutral-500 text-lg">One-click sync to Anki, Notion, or Quizlet. Your data, formatted exactly how you like it.</p>
                        </div>
                        <div className="absolute right-[-10%] bottom-[-10%] w-64 h-64 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section id="faq" className="px-6 md:px-12 py-40 max-w-4xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Common Questions</h2>
                    <p className="text-neutral-500">Everything you need to know about the platform.</p>
                </div>

                <div className="space-y-4">
                    {[
                        { q: "How secure are my uploaded documents?", a: "We use enterprise-grade AES-256 encryption. Your PDFs are processed in secure sandboxes and are never used to train global AI models." },
                        { q: "Which languages are supported?", a: "Quiz.ai currently supports over 45 languages, including English, Spanish, Mandarin, and Japanese, with full mathematical notation support." },
                        { q: "Is there a student discount available?", a: "Absolutely. Verified students receive 50% off our Pro plan. Contact our support team with your .edu email." },
                        { q: "Can I collaborate with a study group?", a: "Yes, our Teams plan allows you to share quiz sets, track group progress, and compete in live study leaderboards." }
                    ].map((item, i) => (
                        <Accordion key={i} question={item.q} answer={item.a} />
                    ))}
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="px-6 md:px-12 pb-40">
                <div className="max-w-[1400px] mx-auto bg-[#0a0a0a] border border-white/5 rounded-[4rem] p-12 md:p-32 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-5xl md:text-8xl font-bold tracking-tighter mb-12">Stop reading.<br />Start mastering.</h2>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <button className="h-16 px-12 bg-white text-black font-bold rounded-2xl text-lg hover:scale-105 transition-all">Get Started Now</button>
                            <button className="h-16 px-12 border border-white/10 bg-white/5 font-bold rounded-2xl text-lg hover:bg-white/10 transition-all">Contact Sales</button>
                        </div>
                    </div>
                    {/* Subtle background glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />
                </div>
            </section>

            {/* FOOTER */}
            <footer className="px-6 md:px-12 py-20 border-t border-white/5">
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
                    {["Product", "Company", "Legal"].map((cat) => (
                        <div key={cat} className="space-y-4">
                            <h4 className="text-white font-bold text-sm uppercase tracking-widest">{cat}</h4>
                            <div className="flex flex-col gap-3">
                                {["Link One", "Link Two", "Link Three"].map(l => (
                                    <Link key={l} href="#" className="text-neutral-500 hover:text-white transition-colors text-sm">{l}</Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="max-w-[1400px] mx-auto flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-neutral-600">
                    <span>© 2026 Quizpull.ai Inc.</span>
                    <div className="flex gap-8">
                        <Link href="#" className="hover:text-white">Status</Link>
                        <Link href="#" className="hover:text-white">Security</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function Accordion({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            gsap.to(contentRef.current, {
                height: isOpen ? "auto" : 0,
                opacity: isOpen ? 1 : 0,
                duration: 0.5,
                ease: "power3.inOut"
            });
        }
    }, [isOpen]);

    return (
        <div className="border-b border-white/5">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-8 flex justify-between items-center text-left group"
            >
                <span className="text-xl font-bold tracking-tight group-hover:text-white transition-colors">{question}</span>
                <div className={`p-2 rounded-full border border-white/5 transition-transform duration-500 ${isOpen ? 'rotate-45' : ''}`}>
                    <Plus className="w-4 h-4" />
                </div>
            </button>
            <div ref={contentRef} className="h-0 opacity-0 overflow-hidden">
                <div className="pb-8 text-neutral-500 text-lg leading-relaxed max-w-2xl">
                    {answer}
                </div>
            </div>
        </div>
    );
}