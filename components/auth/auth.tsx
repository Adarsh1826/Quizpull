"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { handleLogin,handleSignup ,handleAuthWithGoogle} from "@/utils/auth";
import { useRouter } from "next/navigation";

export default function AuthPage() {
     const router = useRouter();
    const url = usePathname();
    const page = url.split("/").pop();

    const isLogin = page === "signin";
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
   
    return (
        <div className="flex items-center justify-center min-h-screen max-w-full bg-black">


            <div className="flex flex-col items-center">

                {/* Card */}
                <div className="flex flex-col items-center w-full max-w-sm p-6
                        bg-white/5 backdrop-blur-md
                        border border-white/10
                        rounded-2xl shadow-2xl">

                    {/* Logo */}
                    {/* <div className="mb-4 text-2xl font-bold text-white">
                        Logo
                    </div> */}

                    {/* Text Section */}
                    <div className="text-center mb-6">
                        {isLogin ? (
                            <>
                                <p className="text-lg font-semibold text-white">
                                    Sign in to your account
                                </p>
                                <p className="text-sm text-gray-400">
                                    Welcome back! please enter your details.
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-lg font-semibold text-white">
                                    Create an account
                                </p>
                                <p className="text-sm text-gray-400">
                                    Get started by creating your account.
                                </p>
                            </>
                        )}
                    </div>

                    {/* Form */}
                    <div className="flex flex-col gap-4 w-full">
                        <input
                            type="email"
                            placeholder="Email"
                            onChange={(e)=>{
                                setEmail(e.target.value)
                            }}
                            className="w-full px-4 py-2 rounded-lg 
                         bg-white/5 text-white placeholder-gray-400
                         border border-white/10
                         focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            onChange={(e)=>{
                                setPassword(e.target.value)
                            }}
                            className="w-full px-4 py-2 rounded-lg 
                         bg-white/5 text-white placeholder-gray-400
                         border border-white/10
                         focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />

                        {isLogin ? (<>
                        <button className="w-full py-2 bg-white text-black rounded-lg 
                               hover:opacity-90 transition font-medium" onClick={()=>handleLogin(email,password,router)}>
                            Sign In
                        </button>
                        </>):(<>
                        <button className="w-full py-2 bg-white text-black rounded-lg 
                               hover:opacity-90 transition font-medium" onClick={()=> handleSignup(email,password,router)}>
                           Sign Up
                        </button>
                        </>)}

                        {/* Divider */}
                        <div className="flex items-center w-full">
                            <div className="flex-1 h-px bg-white/20"></div>
                            <span className="px-3 text-sm text-gray-400">OR</span>
                            <div className="flex-1 h-px bg-white/20"></div>
                        </div>

                        <button className="w-full py-2 bg-transparent text-white rounded-lg 
                               border border-white/20 hover:bg-white/10 transition"
                               onClick={handleAuthWithGoogle}>
                            Continue with Google
                        </button>
                    </div>
                </div>

                {/* Bottom Text */}
                <div className="mt-6 text-sm text-gray-400">
                    {isLogin ? (
                        <>
                            Don’t have an account?{" "}
                            <Link href="/auth/signup/" className="text-white hover:underline">
                                Sign up
                            </Link>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <Link href="/auth/signin" className="text-white hover:underline">
                                Sign in
                            </Link>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}