import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExpandableDescription } from "@/components/description";
import defaultBg from "@/assets/defaultBG.jpeg";
import { callPublicApi } from "@/lib/publicApi";
import BookingCard from "@/components/BookingCard";

const getEvent = async (slug: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch event");

  return res.json();
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getDuration = (start: string, end: string) => {
  const s = new Date(start);
  const e = new Date(end);

  const diff = (e.getTime() - s.getTime()) / (1000 * 60 * 60);
  return `${diff} hrs`;
};

export default async function Page({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

    const data = await callPublicApi(`/events/${slug}`)

  const event = data.event;

  const isSoldOut = event.ticketsSold >= event.capacity;
  const isPastEvent = new Date(event.endTime) < new Date();

  const fullLocation = `${event.location.addressLine}, ${event.location.city}`;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black text-white pt-24 pb-20">

      <div className="relative h-[520px] w-full overflow-hidden">
        <img
          src={event.imageUrl || defaultBg.src}
          alt={event.title}
          className="w-full h-full object-cover scale-105"
        />

        <div
          className={`absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent ${
            isPastEvent ? "opacity-80 grayscale" : ""
          }`}
        />

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-6xl px-4">

          <div className="flex flex-wrap gap-2 mb-4">
            {event.tags.map((tag: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 text-xs bg-white/10 border border-white/20 rounded-full backdrop-blur-md"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {event.title}

            {isPastEvent && (
              <span className="ml-3 text-sm bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-md">
                Past Event
              </span>
            )}
          </h1>
          <div className="flex flex-wrap gap-6 text-slate-300 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              {formatDateTime(event.startTime)}
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              {getDuration(event.startTime, event.endTime)}
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              {event.location.city}
            </div>
          </div>
        </div>

        {isPastEvent ? (
          <div className="absolute top-6 right-6 bg-yellow-500/90 px-4 py-2 rounded-lg font-semibold shadow-lg">
            Event Ended
          </div>
        ) : isSoldOut ? (
          <div className="absolute top-6 right-6 bg-red-500/90 px-4 py-2 rounded-lg font-semibold shadow-lg">
            Sold Out
          </div>
        ) : null}
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-12 grid md:grid-cols-3 gap-10">

        <div className="md:col-span-2 space-y-10">

          <div className="grid sm:grid-cols-2 gap-4">

            <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur">
              <Calendar className="mb-2 text-cyan-400" />
              <p className="text-sm text-slate-400">Date & Time</p>
              <p className="font-medium">{formatDateTime(event.startTime)}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur">
              <MapPin className="mb-2 text-cyan-400" />
              <p className="text-sm text-slate-400">Location</p>
              <p className="font-medium">{fullLocation}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur">
              <Users className="mb-2 text-cyan-400" />
              <p className="text-sm text-slate-400">Capacity</p>
              <p className="font-medium">
                {event.ticketsSold}/{event.capacity}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur">
              <Clock className="mb-2 text-cyan-400" />
              <p className="text-sm text-slate-400">Duration</p>
              <p className="font-medium">
                {getDuration(event.startTime, event.endTime)}
              </p>
            </div>
          </div>
          <ExpandableDescription text={event.description} />
        </div>

        <BookingCard eventId={event.id} price={event.price} isPastEvent={isPastEvent} isSoldOut={isSoldOut} />
      </div>
    </main>
  );
}