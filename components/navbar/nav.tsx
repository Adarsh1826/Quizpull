"use client";
import { Search, Bell, UserCircle } from "lucide-react";
import { getUser } from "@/utils/auth";
import { useEffect, useState } from "react";


interface NavbarProps {
  isGuest: boolean;
}

export default function Navbar({ isGuest }: NavbarProps) {
  const [activeUser , setActiveUser] = useState("");
  // for window
  const [isOpen,setIsOpen] = useState(false)
  const fetchActiveUser = async()=>{
    const user = await getUser();
    setActiveUser(user?.email!)
  }


  useEffect(()=>{
    fetchActiveUser();
  },[])

  
  return (
    <header className="h-20 border-b border-white/5  backdrop-blur-md px-6 md:px-10 flex items-center justify-between z-40" style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.07) 0%, transparent 60%)" }}>
      
      {/* Search Bar / Title Area */}
      <div className="flex items-center gap-4 w-full max-w-md">
        <div className="relative w-full group">
          {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-white transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search quizzes or topics..." 
            className="w-full bg-white/5 border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm outline-none focus:border-white/20 focus:bg-white/10 transition-all"
          /> */}
        </div>
      </div>

      {/* Right Side Action Items */}
      <div className="flex items-center gap-6">
        {/* Notifications - Subtle Dot for Logged In */}
        <button className="relative p-2 text-neutral-400 hover:text-white transition-colors">
          {/* <Bell size={20} /> */}
          {!isGuest && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full border-2 border-[#050505]" />
          )}
        </button>

        {/* User Identity */}
        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white leading-none mb-1">
                {!activeUser?(
                  <>
                    Guest User
                    
                  </>
                ):<>
                  {activeUser}
                </>}
            </p>
            {/* <p className="text-[10px] text-neutral-500 uppercase tracking-widest">
              {activeUser ? "Pro Plan" : "Limited Access"}
            </p> */}
          </div>
          
          <div className="w-9 h-9 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center overflow-hidden">
            {/* {isGuest ? ( */}
              <button onClick={()=>{
                setIsOpen(true)
              }}>
                <UserCircle size={24} className="text-neutral-600" />
            
              </button>
           
          </div>
        </div>
      </div>
    </header>
  );
}