import React from 'react';
import { Button } from './ui/button';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950 pt-20 pb-12">
      {/* Clean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950"></div>
      
      {/* Subtle mesh gradient with animation */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[100px] animate-float-delayed"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-24 lg:py-32 w-full">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge with animation */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6 sm:mb-8 backdrop-blur-sm animate-fade-in-up">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 flex-shrink-0 animate-pulse" />
            <span className="text-xs sm:text-sm text-slate-300">Trusted by 500,000+ event-goers worldwide</span>
          </div>

          {/* Headline with staggered animation */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 sm:mb-8 tracking-tight leading-[1.1]">
            <span className="block animate-fade-in-up">Find Your Next</span>
            <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-500 bg-clip-text text-transparent animate-fade-in-up animation-delay-200">
              Unforgettable Event
            </span>
          </h1>

          {/* Subheadline with animation */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-400 mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto px-4 animate-fade-in-up animation-delay-400">
            Discover concerts, workshops, conferences, and community events. 
            Book tickets instantly and make memories that last forever.
          </p>

          {/* CTA Buttons with staggered animation */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4">
            <Button 
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-600"
            >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Explore Events
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 border-white/10 bg-white/5 hover:bg-white/10 text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-700"
            >
              Create Event
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
          </div>

          {/* Stats with animation */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto pt-6 sm:pt-8 border-t border-white/10 px-4 animate-fade-in-up animation-delay-800">
            {[
              { value: '10K+', label: 'Events' },
              { value: '500K+', label: 'Attendees' },
              { value: '50+', label: 'Cities' }
            ].map((stat, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors duration-300 group-hover:scale-110 transform">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;