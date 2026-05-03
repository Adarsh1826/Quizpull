"use client"
import { LayoutDashboard, History, Lock, LogOut, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { handleLogout } from "@/utils/auth";

export default function Sidebar({
  activeUser,
  isOpen = false,
  onClose,
}: {
  activeUser: string;
  isOpen?: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, locked: false },
    { name: "History", icon: History, locked: !activeUser },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-5 h-5 bg-white rotate-45 group-hover:rotate-180 transition-transform duration-500" />
          <span className="font-bold tracking-tighter text-xl uppercase group-hover:text-neutral-300 transition-colors duration-500">
            Quizpull.ai
          </span>
        </div>
        <button
          onClick={onClose}
          className="md:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <button
            key={item.name}
            disabled={item.locked}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${item.locked
              ? "opacity-50 cursor-not-allowed text-neutral-500"
              : "hover:bg-white/5 text-neutral-400 hover:text-white"
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
            <p className="text-[11px] uppercase tracking-widest font-bold text-neutral-500 mb-3">
              Guest Mode
            </p>
            <button
              className="w-full py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-neutral-200 transition-colors"
              onClick={() => { onClose(); router.push("/auth/signin"); }}
            >
              Sign in to Save
            </button>
          </div>
        ) : (
          <button
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"
            onClick={() => { onClose(); handleLogout(router); }}
          >
            <LogOut size={18} />
            Logout
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: always visible */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/5">
        <NavContent />
      </aside>

      {/* Mobile: only mounts when open */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />
          {/* Drawer — identical styles to desktop */}
          <aside className="fixed top-0 left-0 h-full w-64 z-50 flex flex-col md:hidden border-r border-white/5">
            <NavContent />
          </aside>
        </>
      )}
    </>
  );
}