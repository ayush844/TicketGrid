"use client";

import { useEffect, useState } from "react";
import { getEvents } from "@/lib/api";
import { EventCard } from "@/components/FeaturedEvents";
import { useRouter, useSearchParams } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTab =
    (searchParams.get("tab") as "upcoming" | "past") || "upcoming";
  const initialPage = Number(searchParams.get("page")) || 1;

  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [past, setPast] = useState<any[]>([]);
  const [counts, setCounts] = useState({ upcoming: 0, past: 0 });

  const [activeTab, setActiveTab] = useState<"upcoming" | "past">(initialTab);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(true);

  const LIMIT = 10;

  // 🔁 Sync URL
  useEffect(() => {
    router.replace(`?tab=${activeTab}&page=${page}`);
  }, [activeTab, page]);

  // 📦 Fetch data
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getEvents(page, LIMIT);

        setUpcoming(data?.upcoming || []);
        setPast(data?.past || []);
        setCounts(data?.count || { upcoming: 0, past: 0 });
      } catch (error) {
        console.error(error);
        setUpcoming([]);
        setPast([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page]);

  const isUpcoming = activeTab === "upcoming";
  const eventsToRender = isUpcoming ? upcoming : past;
  const totalCount = isUpcoming ? counts.upcoming : counts.past;

  const totalPages = Math.ceil(totalCount / LIMIT);

  const isPrevDisabled = page === 1;
  const isNextDisabled = page >= totalPages;

  // 🔁 Tab change resets page
  const handleTabChange = (tab: "upcoming" | "past") => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-4">

        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold tracking-tight">
            Discover Events
          </h1>
          <p className="text-slate-400 mt-3 text-sm">
            Find events, workshops, and experiences around you
          </p>
        </div>

        {/* TABS */}
        <div className="flex justify-center mb-10">
          <div className="flex bg-white/5 border border-white/10 rounded-full p-1">
            {["upcoming", "past"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab as any)}
                className={`px-5 py-2 text-sm rounded-full transition-all duration-300
                  ${
                    activeTab === tab
                      ? "bg-white text-black"
                      : "text-slate-400 hover:text-white"
                  }
                `}
              >
                {tab === "upcoming" ? "Upcoming" : "Past"}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : eventsToRender.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg">No events found</p>
          </div>
        ) : (
          <>
            {/* EVENTS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {eventsToRender.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {/* PAGINATION (ONLY UPCOMING) */}
            {isUpcoming && totalPages > 1 && (
              <div className="flex justify-center items-center gap-6 mt-12">

                {/* PREV */}
                <button
                  disabled={isPrevDisabled}
                  onClick={() => setPage((p) => p - 1)}
                  className={`px-4 py-2 text-sm rounded-md border transition
                    ${
                      isPrevDisabled
                        ? "bg-white/5 border-white/10 text-slate-500 cursor-not-allowed"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }
                  `}
                >
                  ← Prev
                </button>

                {/* PAGE INFO */}
                <span className="text-sm text-slate-400">
                  Page {page} of {totalPages}
                </span>

                {/* NEXT */}
                <button
                  disabled={isNextDisabled}
                  onClick={() => setPage((p) => p + 1)}
                  className={`px-4 py-2 text-sm rounded-md border transition
                    ${
                      isNextDisabled
                        ? "bg-white/5 border-white/10 text-slate-500 cursor-not-allowed"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }
                  `}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}