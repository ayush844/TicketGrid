"use client";

import { useEffect, useState, useRef } from "react";
import { getUpcomingEvents, getPastEvents } from "@/lib/api";
import { EventCard } from "@/components/FeaturedEvents";
import { useRouter, useSearchParams } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTab =
    (searchParams.get("tab") as "upcoming" | "past") || "upcoming";
  const initialPage = Number(searchParams.get("page")) || 1;

  const [events, setEvents] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const [activeTab, setActiveTab] =
    useState<"upcoming" | "past">(initialTab);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(true);

  const [isFetched, setIsFetched] = useState(false);

  const LIMIT = 6;
  const CACHE_TTL = 30 * 1000;

  const cacheRef = useRef<{
    upcoming: Record<number, any>;
    past: Record<number, any>;
  }>({
    upcoming: {},
    past: {}
  });

  const requestIdRef = useRef(0);

  useEffect(() => {
    router.replace(`?tab=${activeTab}&page=${page}`);
  }, [activeTab, page]);

  useEffect(() => {
    const fetchEvents = async () => {
      const requestId = ++requestIdRef.current;

      try {
        const tabCache = cacheRef.current[activeTab];
        const cached = tabCache[page];
        const now = Date.now();

        setIsFetched(false);

        if (cached) {
          setEvents(cached.events);
          setTotalPages(cached.totalPages);

          if (now - cached.timestamp < CACHE_TTL) {
            setLoading(false);
            setIsFetched(true);
            return;
          }
        } else {
          setEvents([]);
          setLoading(true);
        }

        let data;
        if (activeTab === "upcoming") {
          data = await getUpcomingEvents(page, LIMIT);
        } else {
          data = await getPastEvents(page, LIMIT);
        }

        if (requestId !== requestIdRef.current) return;

        const formattedData = {
          events: data?.events || [],
          totalPages: data?.totalPages || 1,
          timestamp: now
        };

        cacheRef.current[activeTab][page] = formattedData;

        setEvents(formattedData.events);
        setTotalPages(formattedData.totalPages);
        setIsFetched(true);

        if (page < formattedData.totalPages) {
          if (activeTab === "upcoming") {
            getUpcomingEvents(page + 1, LIMIT);
          } else {
            getPastEvents(page + 1, LIMIT);
          }
        }

      } catch (error) {
        console.error(error);
        setEvents([]);
        setIsFetched(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page, activeTab]);

  const isPrevDisabled = page === 1;
  const isNextDisabled = page >= totalPages;

  const handleTabChange = (tab: "upcoming" | "past") => {
    setActiveTab(tab);
    setPage(1);

    const hasCache = cacheRef.current[tab][1];

    if (!hasCache) {
      setEvents([]);
      setLoading(true);
      setIsFetched(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-4">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold tracking-tight">
            Discover Events
          </h1>
          <p className="text-slate-400 mt-3 text-sm">
            Find events, workshops, and experiences around you
          </p>
        </div>

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

        {loading || !isFetched ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg">No events found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-6 mt-12">

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

                <span className="text-sm text-slate-400">
                  Page {page} of {totalPages}
                </span>

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