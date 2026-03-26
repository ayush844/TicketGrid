"use client";

import Link from "next/link";
import { CheckCircle, Ticket, Mail, Info } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function BookingSuccessPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();

  const bookingId = searchParams.get("bookingId");

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">

      <div className="max-w-md w-full text-center bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-xl">

        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-400" />
        </div>

        <h1 className="text-2xl font-bold mb-3">
          Payment Successful
        </h1>

        <p className="text-slate-400 mb-4">
          Your booking has been confirmed.
        </p>

        {/* ✅ SHOW BOOKING ID */}
        {bookingId && (
          <p className="text-xs text-slate-500 mb-6">
            Booking ID: {bookingId}
          </p>
        )}

        {!bookingId && (
        <div className="flex items-center justify-center gap-2 border border-yellow-400/10 rounded-xl p-4 text-yellow-400 text-sm mb-4">
            <Info className="w-4 h-4" />
            <span>
            We couldn't verify your booking. Please check your bookings or contact support.
            </span>
        </div>
        )}

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-sm text-slate-300 space-y-2">

          <div className="flex items-center gap-2 justify-center">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Booking confirmed</span>
          </div>

          <div className="flex items-center gap-2 justify-center">
            <Ticket className="w-4 h-4 text-cyan-400" />
            <span>Tickets generated</span>
          </div>
{/* 
          <div className="flex items-center gap-2 justify-center">
            <Mail className="w-4 h-4 text-yellow-400" />
            <span>Confirmation sent (if enabled)</span>
          </div> */}
        </div>

        {!session && (
          <div className="flex items-center justify-center gap-2 text-yellow-400 text-sm mb-4">
            <Info className="w-4 h-4" />
            <span>Sign in to view your booking</span>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {session ? (
            <Link
              href={`/my-bookings`}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 font-semibold"
            >
              View My Bookings
            </Link>
          ) : (
            <Link
              href="/signin"
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 font-semibold"
            >
              Sign In
            </Link>
          )}

          <Link
            href="/"
            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}