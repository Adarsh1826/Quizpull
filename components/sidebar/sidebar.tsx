"use client"
import { LayoutDashboard, Zap, History, BarChart3, Lock, LogOut, UserCircle } from "lucide-react";
import { getUser } from "@/utils/auth";
import { useEffect ,useState } from "react";
import { useRouter } from "next/navigation";
import { handleLogout } from "@/utils/auth";
export default function Sidebar({activeUser}:{activeUser:string}) {
  const router = useRouter()
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, locked: false },
    // { name: "Generate Quiz", icon: Zap, locked: false },
    { name: "History", icon: History, locked: !activeUser },
    // { name: "Analytics", icon: BarChart3, locked: isGuest },
  ];
  
  return (
    <aside className="w-64 border-r border-white/5  hidden md:flex flex-col" >
      <div className="p-6 flex items-center gap-3">
        
        <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-5 h-5 bg-white rotate-45 group-hover:rotate-180 transition-transform duration-500" />
            <span className="font-bold tracking-tighter text-xl uppercase">
              Quizpull.ai
            </span>
          </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <button
            key={item.name}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${item.locked ? "opacity-50 cursor-not-allowed" : "hover:bg-white/5 text-neutral-400 hover:text-white"
              }`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={18} />
              {item.name}
            </div>
            {item.locked && <Lock size={14} className="text-neutral-600" />}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        {!activeUser ? (
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-[11px] uppercase tracking-widest font-bold text-neutral-500 mb-3">Guest Mode</p>
            <button className="w-full py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-neutral-200 transition-colors"
              onClick={()=>{
                router.push("/auth/signin")
              }}
            >
              Sign in to Save
            </button>
          </div>
        ) : (
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"
          onClick={()=>handleLogout(router)}>
            <LogOut size={18} />
            Logout
          </button>
        )}
      </div>
    </aside>
  );
}