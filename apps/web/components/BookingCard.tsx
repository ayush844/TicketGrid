"use client";

import { useState } from "react";
import { toast } from "sonner";

type Props = {
  eventId: string;
  price: number;
  isSoldOut: boolean;
  isPastEvent: boolean;
};

const BookingCard = ({
  eventId,
  price,
  isSoldOut,
  isPastEvent,
}: Props) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const increase = () => {
    if (quantity < 10 && !bookingId) setQuantity((q) => q + 1);
  };

  const decrease = () => {
    if (quantity > 1 && !bookingId) setQuantity((q) => q - 1);
  };

  const handleReserve = async () => {
    if(loading) return;
    try {
      setLoading(true);

      const response = await fetch(`/api/events/${eventId}/reserve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      });

      if (response.status === 401) {
        window.location.href = "/signin";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setBookingId(data.bookingId);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Reservation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if(loading) return;
    try {
      setLoading(true);

      const response = await fetch(
        `/api/bookings/${bookingId}/checkout`,
        {
          method: "POST",
        }
      );

      if (response.status === 401) {
        window.location.href = "/signin";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      // redirect to stripe
      window.location.href = data.checkoutUrl;
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  const total = price * quantity;
  const disabled = isSoldOut || isPastEvent || loading;

  return (
    <div className="bg-white/5 border border-white/10 hover:border-cyan-500/40 rounded-2xl p-6 backdrop-blur-xl shadow-xl transition-all duration-300 hover:shadow-cyan-500/10">

      {/* PRICE */}
      <div className="mb-6">
        <p className="text-sm text-slate-400">Price per ticket</p>
        <h2 className="text-4xl font-bold text-cyan-400 tracking-tight">
          ₹{price}
        </h2>
      </div>

      {bookingId && (
        <p className="text-xs text-green-400 text-center mb-4">
          Booking created. Complete payment to confirm.
        </p>
      )}

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-400">Tickets</p>

        <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1 gap-2">
          <button
            onClick={decrease}
            disabled={!!bookingId} 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition disabled:opacity-40"
          >
            −
          </button>

          <span className="w-8 text-center font-semibold text-lg">
            {quantity}
          </span>

          <button
            onClick={increase}
            disabled={!!bookingId} 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <span className="text-slate-400 text-sm">Total</span>
        <span className="text-xl font-semibold text-white">
          ₹{total}
        </span>
      </div>

      <div className="h-px bg-white/10 mb-6" />

      <button
        disabled={disabled}
        onClick={bookingId ? handleCheckout : handleReserve}
        className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
          isPastEvent || isSoldOut
            ? "bg-gray-600 cursor-not-allowed opacity-70"
            : bookingId
            ? "bg-green-500 hover:bg-green-600 shadow-md"
            : "bg-cyan-500 hover:bg-cyan-600 shadow-md"
        }`}
      >
        {loading
          ? bookingId
            ? "Redirecting to payment..."
            : "Processing..."
          : isPastEvent
          ? "Event Ended"
          : isSoldOut
          ? "Sold Out"
          : bookingId
          ? "Make Payment"
          : `Reserve for ₹${total}`}
      </button>

      {!disabled && (
        <p className="text-xs text-slate-500 mt-4 text-center">
          Secure checkout • Instant confirmation
        </p>
      )}
    </div>
  );
};

export default BookingCard;