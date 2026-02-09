import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { featuredEvents } from '../data/mock';

interface iEvent {
    id: number;
    name: string;
    date: string;
    time: string;
    location: string;
    price: number;
    category: string;
    image: string;
    featured: boolean;
}
 

const EventCard = ({ event } : { event: iEvent }) => {
  const formatDate = (dateString : string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="group relative overflow-hidden bg-slate-900/50 border border-white/10 hover:border-cyan-500/50 transition-all duration-500 cursor-pointer backdrop-blur-sm hover-lift animate-fade-in-up">
      {/* Event Image */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={event.image} 
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        
        {/* Category with slide animation */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-semibold text-white uppercase transition-all duration-300 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/50 group-hover:scale-110">
          {event.category}
        </div>
        
        {/* Price with pulse animation */}
        <div className="absolute bottom-4 right-4 px-4 py-2 bg-cyan-500 text-white rounded-lg font-bold shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-cyan-500/50 animate-scale-in">
          ${event.price}
        </div>
      </div>

      {/* Event Details */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 group-hover:text-cyan-400 transition-colors duration-300">
          {event.name}
        </h3>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-300 transition-all duration-300 group-hover:translate-x-1">
            <Calendar className="w-4 h-4 text-cyan-500" />
            <span className="text-sm">{formatDate(event.date)} • {event.time}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-300 transition-all duration-300 group-hover:translate-x-1">
            <MapPin className="w-4 h-4 text-cyan-500" />
            <span className="text-sm line-clamp-1">{event.location}</span>
          </div>
        </div>

        <Button 
          className="w-full bg-white/5 hover:bg-cyan-500 border border-white/10 hover:border-cyan-500 text-white transition-all duration-300 group/btn"
        >
          View Details
          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
        </Button>
      </div>
    </Card>
  );
};

const FeaturedEvents = () => {
  return (
    <section id="events" className="relative py-16 sm:py-20 lg:py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            Upcoming Events
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto px-4">
            Discover amazing experiences happening near you
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {featuredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center px-4">
          <Button 
            size="lg"
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border-2 border-white/10 hover:border-cyan-500 text-white px-6 sm:px-8 py-5 sm:py-6 transition-all duration-300"
          >
            View All Events
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;