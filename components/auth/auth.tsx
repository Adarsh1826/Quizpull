"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { handleLogin, handleSignup, handleAuthWithGoogle } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const url = usePathname();
  const page = url.split("/").pop();
  const isLogin = page === "signin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await handleLogin(email, password, router);
      } else {
        await handleSignup(email, password, router);
      }
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.15) 0%, transparent 60%), #050505",
      }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-indigo-600/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo / Brand */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="w-5 h-5 bg-white rotate-45" />
          <span className="font-bold tracking-tighter text-xl uppercase text-white">
            Quizpull.ai
          </span>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {isLogin ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              {isLogin
                ? "Sign in to continue your learning streak."
                : "Start learning smarter with AI-powered quizzes."}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Form fields */}
          <div className="space-y-4">
            {/* Email */}
            <div className="group">
              <label className="block text-xs text-neutral-500 font-medium mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-neutral-400 transition-colors"
                />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 text-white placeholder-neutral-600 border border-white/[0.07] focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <label className="block text-xs text-neutral-500 font-medium mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-neutral-400 transition-colors"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/5 text-white placeholder-neutral-600 border border-white/[0.07] focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Forgot password (login only) */}
            {isLogin && (
              <div className="flex justify-end">
                <button className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            {/* Primary CTA */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 mt-1 rounded-xl bg-white text-black text-sm font-semibold hover:bg-neutral-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign in" : "Create account"}
                  <ArrowRight size={14} />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-white/[0.07]" />
              <span className="text-xs text-neutral-600 uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-white/[0.07]" />
            </div>

            {/* Google */}
            <button
              onClick={handleAuthWithGoogle}
              className="w-full py-3 rounded-xl bg-transparent border border-white/[0.09] text-neutral-300 text-sm font-medium hover:bg-white/5 hover:border-white/15 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
            >
              {/* Google Icon SVG */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
          </div>
        </div>

        {/* Bottom switch */}
        <p className="text-center text-sm text-neutral-600 mt-6">
          {isLogin ? (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-neutral-300 hover:text-white font-medium transition-colors">
                Sign up free
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-neutral-300 hover:text-white font-medium transition-colors">
                Sign in
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}