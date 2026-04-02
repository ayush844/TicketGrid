"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">

        {/* 404 */}
        <h1 className="text-6xl font-bold text-white tracking-tight">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-xl font-semibold text-white">
          Page not found
        </h2>

        {/* Description */}
        <p className="mt-2 text-sm text-slate-400">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        {/* Divider */}
        <div className="my-8 h-px bg-white/10" />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto bg-white text-black hover:bg-white/90">
              Go home
            </Button>
          </Link>

          <Link href="/events">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10"
            >
              View events
            </Button>
          </Link>
        </div>

        {/* Back */}
        <button
          onClick={() => window.history.back()}
          className="mt-6 text-sm text-slate-500 hover:text-white inline-flex items-center gap-2 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back
        </button>

      </div>
    </div>
  );
}