import React from 'react';
import { Search, CreditCard, PartyPopper } from 'lucide-react';

const steps = [
  {
    step: 1,
    title: "Discover Events",
    description: "Browse thousands of events and find what excites you",
    icon: Search,
  },
  {
    step: 2,
    title: "Book Securely",
    description: "Quick checkout with secure payment processing",
    icon: CreditCard,
  },
  {
    step: 3,
    title: "Enjoy",
    description: "Get instant tickets and enjoy your experience",
    icon: PartyPopper,
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative py-16 sm:py-20 lg:py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 px-4">
            How It Works
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-400 px-4">
            Three simple steps to your next amazing event
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-16 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.step} 
                className="relative text-center px-4"
              >
                {/* Step number */}
                <div className="relative inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full mb-4 sm:mb-6 shadow-lg">
                  <span className="text-xl sm:text-2xl font-bold text-white">{step.step}</span>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;