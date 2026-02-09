import React from 'react';
import { Button } from './ui/button';
import { Users, TrendingUp, BarChart3, Zap, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: "Easy Event Creation",
    description: "Create your event page in minutes"
  },
  {
    icon: TrendingUp,
    title: "Sell Tickets",
    description: "Manage and sell tickets 24/7"
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Track sales and insights"
  },
  {
    icon: Zap,
    title: "Instant Payouts",
    description: "Get paid quickly and securely"
  }
];

const ForOrganizers = () => {
  return (
    <section id="for-organizers" className="relative py-16 sm:py-20 lg:py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="px-4 lg:px-0">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              For Event
              <span className="block mt-2 bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
                Organizers
              </span>
            </h2>

            <p className="text-base sm:text-lg lg:text-xl text-slate-400 mb-8 sm:mb-10">
              Everything you need to create, manage, and grow your events
            </p>

            <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={index} 
                    className="flex gap-3 sm:gap-4 items-start"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white mb-1">{feature.title}</h3>
                      <p className="text-sm sm:text-base text-slate-400">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button 
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-6 sm:px-8 py-5 sm:py-6 shadow-lg transition-all duration-300"
            >
              Start Hosting
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
          </div>

          {/* Right Content - Stats */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 px-4 lg:px-0">
            {[
              { value: '95%', label: 'Satisfaction' },
              { value: '$2.5M+', label: 'Revenue' },
              { value: '24/7', label: 'Support' },
              { value: '2.5%', label: 'Fee' }
            ].map((stat, index) => (
              <div 
                key={index}
                className="bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-xs sm:text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForOrganizers;