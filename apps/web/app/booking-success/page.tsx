"use client";

import Link from "next/link";
import {
  CheckCircle,
  Ticket,
  Info,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import TicketCard from "@/components/Ticket";

export default function BookingSuccessPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] = useState<any>(null);
  const [open, setOpen] = useState(false);


  useEffect(() => { 
        if (!bookingId) return;
        let attempts = 0;
        const fetchBooking = async () => { 
            try {
                const res = await fetch(`/api/bookings/${bookingId}`);
                const data = await res.json();

                if (data?.booking?.tickets?.length) {
                    setBooking(data.booking);
                    return;
                }

                if (attempts < 5) {
                    attempts++;
                    setTimeout(fetchBooking, 1500); // retry
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchBooking();
    }, [bookingId]);

  useEffect(() => {
    if (open) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "auto";
    }

    return () => {
        document.body.style.overflow = "auto";
    };
    }, [open]);

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-4 py-10">

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

        {bookingId && (
          <p className="text-xs text-slate-500 mb-6 break-all">
            Booking ID: {bookingId}
          </p>
        )}

        {!bookingId && (
          <div className="flex items-center justify-center gap-2 border border-yellow-400/10 rounded-xl p-4 text-yellow-400 text-sm mb-4">
            <Info className="w-4 h-4" />
            <span>
              We couldn't verify your booking. Please check your bookings.
            </span>
          </div>
        )}

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-sm text-slate-300 space-y-3">

          <div className="flex items-center gap-2 justify-center">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Booking confirmed</span>
          </div>
            {booking && 
                <div className="flex items-center gap-2 justify-center">
                    <Ticket className="w-4 h-4 text-cyan-400" />
                    <span>Tickets generated</span>
                </div>
            }

          {booking ? (
            <button
              onClick={() => setOpen(true)}
              className="mt-2 w-full py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-medium transition"
            >
              View Your Tickets
            </button>
          ) : (
            <p className="text-center text-xs text-slate-400">
              Loading your tickets...
            </p>
          )}
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
              href="/dashboard"
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

      {open && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">

          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-white/10 rounded-2xl p-6">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                Your Tickets
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X />
              </button>
            </div>

            <div className="space-y-5">
                {booking?.tickets?.map((ticket: any, index: number) => (
                <TicketCard key={ticket.id} ticket={ticket} index={index} event={booking.event} />
                ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}