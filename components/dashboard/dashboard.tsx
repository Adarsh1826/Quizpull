"use client";

import React, { useState } from "react";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/nav";
import UploadSection from "../upload/upload";
import StatsSection from "../stats/stat";
import HistorySection from "../history/history";
import { AllFilePage } from "../allfiles/allfiles";
import { useEffect } from "react";

export default function DashboardPage() {
  const [isGuest, setIsGuest] = useState(true);
  const [hasGeneratedQuiz, setHasGeneratedQuiz] = useState(false);

  const [latestUpload, setLatestUpload] = useState<any>(null);
  useEffect(() => {
  window.history.replaceState({}, document.title, "/dashboard");
}, []);

  return (
    <div
      className="flex min-h-screen text-[#ededed] selection:bg-white selection:text-black"
      style={{
        background: "#050505",
        backgroundImage:
          "radial-gradient(ellipse 90% 60% at 50% -5%, rgba(139,92,246,0.18) 0%, transparent 55%)",
      }}
    >
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <Sidebar isGuest={isGuest} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar isGuest={isGuest} />

        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar">
          {/* Top Row: Upload & Stats */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <UploadSection onUploadSuccess={(newFile) => setLatestUpload(newFile)} />
            </div>
            <div className="lg:col-span-1">
              <StatsSection isGuest={isGuest} />
            </div>
          </div>

          {/* History Section */}
          <section id="history">
            <HistorySection isGuest={isGuest} />
          </section>
        </div>
        <AllFilePage newFile={latestUpload} />
      </main>
    </div>
  );
}