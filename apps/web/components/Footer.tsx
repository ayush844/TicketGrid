import React from 'react';
import { Ticket, Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
<footer className="relative bg-slate-950 text-slate-300 border-t border-slate-900">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-14">
    
    {/* Top row: Brand + Socials */}
    <div className="flex flex-col md:flex-row items-center justify-between gap-10">
      
      {/* Brand */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl blur-md opacity-60" />
          <div className="relative w-11 h-11 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center">
            <Ticket className="w-6 h-6 text-white" />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            TicketGrid
          </h3>
          <p className="text-sm text-slate-400">
            Discover and host unforgettable events
          </p>
        </div>
      </div>

      {/* Social Icons */}
      <div className="flex gap-3">
        {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
          <a
            key={index}
            href="#"
            className="group w-11 h-11 flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/50 hover:bg-slate-800 transition-all duration-300"
          >
            <Icon className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors duration-300" />
          </a>
        ))}
      </div>
    </div>

    {/* Bottom bar */}
    <div className="mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
      <p>© {currentYear} TicketGrid. All rights reserved.</p>
      <p>Made with passion by Ayush Sharma</p>
    </div>

  </div>
</footer>


  );
};

export default Footer;