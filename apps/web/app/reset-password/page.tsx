"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Lock } from "lucide-react";
import { toast } from "sonner";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const passwordRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    const password = passwordRef.current?.value;

    if (!password || !token) {
      toast.error("Invalid request");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            password
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success("Password reset successful");

      router.push("/signin");

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
          Reset Password
        </h2>

        <form onSubmit={handleReset} className="space-y-4">

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="password"
              placeholder="New password"
              ref={passwordRef}
              className="w-full pl-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-red-500 text-white py-3 rounded-xl"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

        </form>
      </div>
    </section>
  );
}