"use client";

import { useEffect, useState } from "react";
import { Calendar, Ticket, MapPin, X } from "lucide-react";
import TicketCard from "@/components/Ticket";
import defaultBg from "@/assets/defaultBG.jpeg";

type Props = {
  booking: any;
};

const BookingTicketCard = ({ booking }: Props) => {
  const [open, setOpen] = useState(false);
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
  const event = booking.event;

  const isPast = new Date(event.startTime) < new Date();

  return (
    <>
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur hover:border-cyan-500/40 transition">

        <img
          src={event.imageUrl || defaultBg.src}
          alt={event.title}
          className="w-full h-40 object-cover rounded-lg mb-4"
        />

        <h3 className="text-lg font-semibold mb-2">
          {event.title}
        </h3>

        <div className="text-sm text-slate-400 space-y-1 mb-4">

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date(event.startTime).toLocaleDateString()}
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {event.location?.city || "Location"}
          </div>

          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4" />
            {booking.quantity} tickets
          </div>

        </div>

        <div className="flex justify-between items-center">

          <span
            className={`text-xs px-2 py-1 rounded ${
              isPast
                ? "bg-gray-700 text-gray-300"
                : "bg-green-500/10 text-green-400"
            }`}
          >
            {isPast ? "Completed" : "Upcoming"}
          </span>

          <button
            onClick={() => setOpen(true)}
            className="text-sm text-cyan-400 hover:text-cyan-300"
          >
            View Tickets
          </button>

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
    </>
  );
};

export default BookingTicketCard;