"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { Calendar, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const avatarUrl = session?.user?.email
    ? `https://robohash.org/${session.user.email}?set=set4`
    : null;

  // Close avatar dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
  }, [mobileOpen]);

  const linkClasses = (href: string) =>
    `text-sm font-medium transition ${
      pathname === href
        ? "text-cyan-400"
        : "text-slate-300 hover:text-white"
    }`;

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-[60]">
        <div className="absolute inset-0 backdrop-blur-xl bg-white/5 border-b border-white/10"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold group"
          >
            <Calendar className="w-6 h-6 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
              TicketGrid
            </span>
          </Link>

          {/* CENTER LINKS DESKTOP */}
          <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            <Link href="/events" className={linkClasses("/events")}>
              Events
            </Link>
            <Link href="/dashboard" className={linkClasses("/dashboard")}>
              Dashboard
            </Link>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">
            {status === "loading" ? null : !session ? (
              <div className="hidden md:flex items-center gap-4">
                <Link
                  href="/signin"
                  className="px-5 py-2 text-sm font-semibold text-white border border-white/20 bg-white/5 rounded-full hover:bg-white/10 transition"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full text-white shadow-lg hover:scale-105 transition"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button onClick={() => setOpen(!open)}>
                  <img
                    src={avatarUrl!}
                    alt="avatar"
                    className="w-12 h-12 rounded-full border border-white/10"
                  />
                </button>

                {open && (
                  <div className="absolute right-0 mt-4 w-56 bg-slate-900 border border-white/10 rounded-xl p-3 shadow-xl">
                    <p className="text-sm text-white truncate">
                      {session.user.email}
                    </p>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="mt-3 text-red-500 text-sm"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* HAMBURGER */}
            <button
              className="md:hidden relative w-6 h-6 z-[70]"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <span
                className={`absolute w-6 h-0.5 bg-white transition-all ${
                  mobileOpen ? "rotate-45 top-3" : "top-1"
                }`}
              />
              <span
                className={`absolute w-6 h-0.5 bg-white transition-all ${
                  mobileOpen ? "opacity-0" : "top-3"
                }`}
              />
              <span
                className={`absolute w-6 h-0.5 bg-white transition-all ${
                  mobileOpen ? "-rotate-45 top-3" : "top-5"
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-[40] md:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* MOBILE MENU */}
      <div
        className={`fixed top-0 left-0 w-full bg-slate-900 backdrop-blur-xl border-b border-white/10 px-6 pt-24 pb-6 space-y-6 transform transition-all duration-300 z-[50] md:hidden ${
          mobileOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <Link
          href="/events"
          onClick={() => setMobileOpen(false)}
          className="block text-lg text-white"
        >
          Events
        </Link>

        <Link
          href="/dashboard"
          onClick={() => setMobileOpen(false)}
          className="block text-lg text-white"
        >
          Dashboard
        </Link>

        {!session ? (
          <div className="space-y-4 pt-6 border-t border-white/10">
            <Link
              href="/signin"
              onClick={() => setMobileOpen(false)}
              className="block text-center px-5 py-3 border border-white/20 rounded-full text-white"
            >
              Login
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="block text-center px-5 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full text-white"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <button
            onClick={() => {
              signOut({ callbackUrl: "/" });
              setMobileOpen(false);
            }}
            className="text-red-500 pt-6 border-t border-white/10"
          >
            Logout
          </button>
        )}
      </div>
    </>
  );
}