// "use client"
// import { LayoutDashboard, Zap, History, BarChart3, Lock, LogOut, UserCircle } from "lucide-react";
// import { getUser } from "@/utils/auth";
// import { useEffect ,useState } from "react";
// import { useRouter } from "next/navigation";
// import { handleLogout } from "@/utils/auth";
// export default function Sidebar({activeUser}:{activeUser:string}) {
//   const router = useRouter()
//   const navItems = [
//     { name: "Dashboard", icon: LayoutDashboard, locked: false },
//     // { name: "Generate Quiz", icon: Zap, locked: false },
//     { name: "History", icon: History, locked: !activeUser },
//     // { name: "Analytics", icon: BarChart3, locked: isGuest },
//   ];
  
//   return (
//     <aside className="w-64 border-r border-white/5  hidden md:flex flex-col" >
//       <div className="p-6 flex items-center gap-3">
        
//         <div className="flex items-center gap-2 group cursor-pointer">
//             <div className="w-5 h-5 bg-white rotate-45 group-hover:rotate-180 transition-transform duration-500" />
//             <span className="font-bold tracking-tighter text-xl uppercase">
//               Quizpull.ai
//             </span>
//           </div>
//       </div>

//       <nav className="flex-1 px-4 space-y-2 mt-4">
//         {navItems.map((item) => (
//           <button
//             key={item.name}
//             className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${item.locked ? "opacity-50 cursor-not-allowed" : "hover:bg-white/5 text-neutral-400 hover:text-white"
//               }`}
//           >
//             <div className="flex items-center gap-3">
//               <item.icon size={18} />
//               {item.name}
//             </div>
//             {item.locked && <Lock size={14} className="text-neutral-600" />}
//           </button>
//         ))}
//       </nav>

//       <div className="p-4 border-t border-white/5">
//         {!activeUser ? (
//           <div className="bg-white/5 rounded-xl p-4 border border-white/10">
//             <p className="text-[11px] uppercase tracking-widest font-bold text-neutral-500 mb-3">Guest Mode</p>
//             <button className="w-full py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-neutral-200 transition-colors"
//               onClick={()=>{
//                 router.push("/auth/signin")
//               }}
//             >
//               Sign in to Save
//             </button>
//           </div>
//         ) : (
//           <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"
//           onClick={()=>handleLogout(router)}>
//             <LogOut size={18} />
//             Logout
//           </button>
//         )}
//       </div>
//     </aside>
//   );
// }



"use client";

import {
  LayoutDashboard, Zap, History, BarChart3,
  Lock, LogOut, UserCircle, X,
} from "lucide-react";
import { getUser, handleLogout } from "@/utils/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SidebarProps {
  isGuest: boolean;
  mobileOpen: boolean;       // controlled from dashboard
  onMobileClose: () => void; // close callback
}

export default function Sidebar({ isGuest, mobileOpen, onMobileClose }: SidebarProps) {
  const router = useRouter();
  const [activeUser, setActiveUser] = useState("");

  const navItems = [
    { name: "Dashboard",     icon: LayoutDashboard, locked: false },
    { name: "Generate Quiz", icon: Zap,             locked: false },
    { name: "History",       icon: History,         locked: isGuest },
    { name: "Analytics",     icon: BarChart3,       locked: isGuest },
  ];

  useEffect(() => {
    getUser().then((u) => setActiveUser(u?.email ?? ""));
  }, []);

  // Close on ESC key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onMobileClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onMobileClose]);

  // ── Shared nav content ─────────────────────────────────
  const Content = () => (
    <div className="flex flex-col h-full">
      {/* Logo + close button */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-white rounded-sm flex-shrink-0" />
          <span className="font-bold tracking-tighter text-lg uppercase">QUIZPULL.ai</span>
        </div>
        {/* X button — only visible in mobile drawer */}
        <button
          onClick={onMobileClose}
          className="md:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-4 space-y-1 mt-2">
        {navItems.map((item) => (
          <button
            key={item.name}
            disabled={item.locked}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all
              ${item.locked
                ? "opacity-40 cursor-not-allowed text-neutral-500"
                : "hover:bg-white/5 text-neutral-400 hover:text-white"
              }`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={18} />
              {item.name}
            </div>
            {item.locked && <Lock size={13} className="text-neutral-600" />}
          </button>
        ))}
      </nav>

      {/* Bottom user block */}
      <div className="p-4 border-t border-white/5">
        {!activeUser ? (
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-[11px] uppercase tracking-widest font-bold text-neutral-500 mb-3">
              Guest Mode
            </p>
            <button
              className="w-full py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-neutral-200 transition-colors"
              onClick={() => { onMobileClose(); router.push("/auth/signin"); }}
            >
              Sign in to Save
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5 mb-2">
              <UserCircle size={16} className="text-neutral-500 flex-shrink-0" />
              <span className="text-xs text-neutral-400 truncate">{activeUser}</span>
            </div>
            <button
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"
              onClick={() => { onMobileClose(); handleLogout(router); }}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ── DESKTOP: always visible, no mobile ────────────── */}
      <aside
        className="w-64 border-r border-white/5 hidden md:flex flex-col"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.07) 0%, transparent 60%)",
        }}
      >
        <Content />
      </aside>

      {/* ── MOBILE: backdrop + slide-in drawer ──────────────
           Only rendered on small screens (md:hidden)         */}

      {/* Dark backdrop — clicking it closes the drawer */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onMobileClose}
      />

      {/* Drawer panel — slides in from the left */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 z-50 md:hidden flex flex-col
          border-r border-white/10 shadow-2xl
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "rgba(8,8,12,0.98)" }}
      >
        <Content />
      </aside>
    </>
  );
}