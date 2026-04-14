"use client";

import { useRef, useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPassword() {
  const emailRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = emailRef.current?.value;

    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      toast.success(data.message || "Reset link sent");

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-3xl">
        
        <h2 className="text-2xl text-white font-bold mb-4">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="email"
              placeholder="Enter your email"
              ref={emailRef}
              className="w-full pl-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-cyan-500 text-white py-3 rounded-xl"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </section>
  );
}