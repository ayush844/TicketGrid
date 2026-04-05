"use client";

import Link from "next/link";
import { XCircle, AlertTriangle, Info } from "lucide-react";
import { useSession } from "next-auth/react";

export default function BookingCancelPage() {
  const { data: session, status } = useSession();

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">

      <div className="max-w-md w-full text-center bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-xl">

        <div className="flex justify-center mb-6">
          <XCircle className="w-16 h-16 text-red-400" />
        </div>

        <h1 className="text-2xl font-bold mb-3">
          Payment Cancelled
        </h1>

        <p className="text-slate-400 mb-6">
          Your payment was not completed.  
          You can try again before your booking expires.
        </p>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6 text-sm text-yellow-300 flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>Your booking is reserved for a limited time.</span>
        </div>

        {status !== "loading" && !session && (
          <div className="flex items-center justify-center gap-2 text-yellow-400 text-sm mb-4">
            <Info className="w-4 h-4" />
            <span>Sign in to continue your booking.</span>
          </div>
        )}

        <div className="flex flex-col gap-3">


          <Link
            href="/"
            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}