import React, { Suspense } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { getFeaturedEvents } from '../data/mock';
import defaultBg from "../assets/defaultBG.jpeg";
import Link from 'next/link';

interface iEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  startTime: string;
  endTime: string;
  price: number;
  imageUrl: string | null;
  tags: string[];
  location: {
    city: string;
    state: string;
    country: string;
    addressLine: string;
  };
}

export const EventCard = ({ event }: { event: iEvent }) => {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `${formattedDate} • ${formattedTime}`;
  };

  const fullLocation = `${event.location.addressLine}, ${event.location.city}`;

  return (
    <Card className="group relative overflow-hidden bg-slate-900/50 border border-white/10 hover:border-cyan-500/50 transition-all duration-500 cursor-pointer backdrop-blur-sm hover-lift animate-fade-in-up">

      <div className="relative h-56 overflow-hidden">
        <img 
          src={event.imageUrl || defaultBg.src} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {event.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/20 rounded-full text-xs font-semibold text-white uppercase transition-all duration-300 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/50"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="absolute bottom-4 right-4 px-4 py-2 bg-cyan-500 text-white rounded-lg font-bold shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-cyan-500/50">
          ₹{event.price}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 group-hover:text-cyan-400 transition-colors duration-300">
          {event.title}
        </h3>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-300 transition-all duration-300 group-hover:translate-x-1">
            <Calendar className="w-4 h-4 text-cyan-500" />
            <span className="text-sm">
              {formatDateTime(event.startTime)}
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-300 transition-all duration-300 group-hover:translate-x-1">
            <MapPin className="w-4 h-4 text-cyan-500" />
            <span className="text-sm line-clamp-1">
              {fullLocation}
            </span>
          </div>
        </div>
        <Link href={`/events/${event.slug}`}>
        <Button 
          className="w-full bg-white/5 hover:bg-cyan-500 border border-white/10 hover:border-cyan-500 text-white transition-all duration-300 group/btn"
        >
          View Details
          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
        </Button>
        </Link>
      </div>
    </Card>
  );
};

const EventCardSkeleton = () => {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden animate-pulse">
      <div className="h-56 bg-white/10" />
      <div className="p-6 space-y-4">
        <div className="h-5 bg-white/10 rounded w-3/4" />
        <div className="h-4 bg-white/10 rounded w-1/2" />
        <div className="h-10 bg-white/10 rounded" />
      </div>
    </div>
  );
};

const FeaturedEventsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
      {[...Array(6)].map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
};

const FeaturedEventsList = async () => {
  const events = await getFeaturedEvents();

  if (!events.length) {
    return (
      <div className="text-center py-20 text-slate-400">
        No events found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
      {events.map((event: iEvent) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

const FeaturedEvents = () => {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            Upcoming Events
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto px-4">
            Discover amazing experiences happening near you
          </p>
        </div>

        <Suspense fallback={<FeaturedEventsSkeleton />}>
          <FeaturedEventsList />
        </Suspense>

        <div className="text-center px-4">
          <Link href="/events">
            <Button 
              size="lg"
              className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border-2 border-white/10 hover:border-cyan-500 text-white px-6 sm:px-8 py-5 sm:py-6"
            >
              View All Events
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FeaturedEvents;