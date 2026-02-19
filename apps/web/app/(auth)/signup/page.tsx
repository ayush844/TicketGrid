"use client"

import React, { useRef, useState } from "react";
import { Mail, Lock, User, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROLES, Roles } from "@/lib/constants";
import { signIn } from "next-auth/react";

const Signup = () => {
  const [role, setRole] = useState<Roles>(ROLES.USER);
  const [loading, setLoading] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleSignup = async(e: React.FormEvent)=>{
    e.preventDefault();

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;

    if(!email || !password || !confirmPassword ){
      alert("Please fill all the fields");
      return;
    }

    if(password !== confirmPassword){
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role
        })
      });

      const data = await response.json();

      if(!response.ok){
        alert(data.message || "Signup failed");
        return;
      }

      alert("Signup successfull, please sign in");

      await signIn("credentials", {
        email,
        password,
        redirect: false
      });
      router.push("/");

    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong. Please try again.");
    } finally{
      setLoading(false);
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden px-4">
      
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950"></div>

      {/* Glow Mesh */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[120px] animate-float-delayed"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-sm text-slate-300">Join the community</span>
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">
              Create Account
            </h2>
            <p className="text-slate-400 text-sm">
              Start discovering and hosting amazing events.
            </p>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-white/5 p-1 rounded-xl mb-6 border border-white/10">
            <button
              type="button"
              onClick={() => setRole(ROLES.USER)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                role === ROLES.USER
                  ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              User
            </button>
            <button
              type="button"
              onClick={() => setRole(ROLES.ORGANIZER)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                role === ROLES.ORGANIZER
                  ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Organizer
            </button>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSignup}>
            
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                placeholder="Email address"
                required
                ref={emailRef}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                placeholder="Password"
                ref={passwordRef}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                placeholder="Confirm password"
                ref={confirmPasswordRef}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading
                ? "Creating Account..."
                : `Create ${role === ROLES.USER ? "User" : "Organizer"} Account`}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link href="/signin" className="text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Signup;