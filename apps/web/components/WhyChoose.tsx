import React from 'react';
import { Shield, Zap, CheckCircle2, LineChart } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: "Fast Booking",
    description: "Complete purchase in seconds"
  },
  {
    icon: LineChart,
    title: "Real-time Updates",
    description: "Live availability tracking"
  },
  {
    icon: CheckCircle2,
    title: "Instant Tickets",
    description: "Digital tickets delivered instantly"
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Bank-level encryption"
  }
];

const WhyChoose = () => {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 px-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            Why Choose TicketGrid
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto">
            The best platform for discovering and booking events
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 px-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="text-center"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-4 sm:mb-6">
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-400" />
                </div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;