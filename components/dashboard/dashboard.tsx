// "use client";

// import React, { useState } from "react";
// import Sidebar from "../sidebar/sidebar";
// import Navbar from "../navbar/nav";
// import UploadSection from "../upload/upload";
// import StatsSection from "../stats/stat";
// import HistorySection from "../history/history";
// // import { AllFilePage } from "../allfiles/allfiles";
// import AllFilePage from "../allfiles/allfiles";
// import { useEffect } from "react";
// import { getUser } from "@/utils/auth";

// export default function DashboardPage() {
//   const [activeUser, setActiveUser] = useState("");
//   const [hasGeneratedQuiz, setHasGeneratedQuiz] = useState(false);
//   const fetchActiveUser = async () => {
//     const user = await getUser();
//     setActiveUser(user?.email!)
//   }

//   const [latestUpload, setLatestUpload] = useState<any>(null);
//   useEffect(() => {
//     window.history.replaceState({}, document.title, "/dashboard");

//   }, []);
//   useEffect(() => {
//     fetchActiveUser();
//   }, []);

//   const AllFilePageComponent = AllFilePage as React.ComponentType<{ newFile: any }>;

//   return (
//     <div
//       className="flex min-h-screen text-[#ededed] selection:bg-white selection:text-black"

//     >

//       <Sidebar activeUser={activeUser} />

//       <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
//         <Navbar activeUser={activeUser} />

//         <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar">
//           {/* Top Row: Upload & Stats */}
//           <div className="grid lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2">
//               <UploadSection onUploadSuccess={(newFile) => setLatestUpload(newFile)} />
//             </div>
//             <div className="lg:col-span-1">
//               <StatsSection activeUser={activeUser} />
//             </div>
//           </div>

//           {/* History Section */}
//           <section id="history">
//             <HistorySection activeUser={activeUser}/>
//           </section>
//         </div>
//         <AllFilePageComponent newFile={latestUpload} />
//       </main>
//     </div>
//   );
// }





"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/nav";
import UploadSection from "../upload/upload";
import StatsSection from "../stats/stat";
import HistorySection from "../history/history";
import AllFilePage from "../allfiles/allfiles";
import { getUser } from "@/utils/auth";

export default function DashboardPage() {
  const [isGuest, setIsGuest] = useState(true);
  const [activeUser, setActiveUser] = useState("");
  const [latestUpload, setLatestUpload] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const AllFilePageComponent = AllFilePage as React.ComponentType<{ newFile: any }>;

  useEffect(() => {
    window.history.replaceState({}, document.title, "/dashboard");
  }, []);

  useEffect(() => {
    const fetchActiveUser = async () => {
      const user = await getUser();
      if (user?.email) setActiveUser(user.email);
    };
    fetchActiveUser();
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  return (
    <div
      className="flex min-h-screen text-[#ededed] selection:bg-white selection:text-black"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.07) 0%, transparent 60%)",
      }}
    >
      <Sidebar
        isGuest={isGuest}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          isGuest={isGuest}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <UploadSection onUploadSuccess={(newFile) => setLatestUpload(newFile)} />
            </div>
            <div className="lg:col-span-1">
              <StatsSection activeUser={activeUser} />
            </div>
          </div>

          <section id="history">
            <HistorySection activeUser={activeUser} />
          </section>
        </div>

        <AllFilePageComponent newFile={latestUpload} />
      </main>
    </div>
  );
}