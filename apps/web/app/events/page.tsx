"use client";

import { useEffect, useState, useRef } from "react";
import { getUpcomingEvents, getPastEvents } from "@/lib/api";
import { EventCard } from "@/components/FeaturedEvents";
import { useRouter, useSearchParams } from "next/navigation";

const ALL_TAGS = [
  "MUSIC","TECH","SPORTS","WORKSHOP",
  "BUSINESS","ART","COMMUNITY","OTHERS"
];

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

  const [search, setSearch] = useState(searchParams.get("search") || "");
  
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get("tag")?.split(",").filter(Boolean) || []
  );

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const buildQuery = () => {
    const params = new URLSearchParams();

    params.append("page", String(page));
    params.append("limit", String(LIMIT));

    if (search) params.append("search", search);

    if (selectedTags.length)
      params.append("tag", selectedTags.join(","));

    return params.toString();
  };

  const buildQueryWithPage = (customPage: number) => {
    const params = new URLSearchParams();

    params.append("page", String(customPage));
    params.append("limit", String(LIMIT));

    if (search) params.append("search", search);
    if (selectedTags.length)
      params.append("tag", selectedTags.join(","));

    return params.toString();
  };

  const LIMIT = 6;
  const CACHE_TTL = 30 * 1000;

  const cacheRef = useRef<Record<string, any>>({});

  const requestIdRef = useRef(0);

  useEffect(() => {
    router.replace(
      `?tab=${activeTab}&page=${page}&search=${search}&tag=${selectedTags.join(",")}`
    );
  }, [activeTab, page]);

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsFilterOpen(false);
    }
  };

  if (isFilterOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [isFilterOpen]);

  useEffect(() => {
    const fetchEvents = async () => {
      const requestId = ++requestIdRef.current;

      try {
        const cacheKey = `${activeTab}-${page}-${search}-${selectedTags.join(",")}`;
        const cached = cacheRef.current[cacheKey];
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
        const query = buildQuery();

        if (activeTab === "upcoming") {
          data = await getUpcomingEvents(query);
        } else {
          data = await getPastEvents(query);
        }

        if (requestId !== requestIdRef.current) return;

        const formattedData = {
          events: data?.events || [],
          totalPages: data?.totalPages || 1,
          timestamp: now
        };

        cacheRef.current[cacheKey] = formattedData;

        setEvents(formattedData.events);
        setTotalPages(formattedData.totalPages);
        setIsFetched(true);

        

        if (page < formattedData.totalPages) {
          const nextQuery = buildQueryWithPage(page + 1);
          if (activeTab === "upcoming") {
            getUpcomingEvents(nextQuery);
          } else {
            getPastEvents(nextQuery);
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
  }, [page, activeTab, search, selectedTags]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  const isPrevDisabled = page === 1;
  const isNextDisabled = page >= totalPages;

  const handleTabChange = (tab: "upcoming" | "past") => {
    setActiveTab(tab);
    setPage(1);

    const hasCache = cacheRef.current[tab]?.[1];

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


<div className="flex justify-center mb-8">

  <div className="flex items-center w-full max-w-xl gap-3">

    {/* SEARCH (PRIMARY) */}
    <input
      type="text"
      placeholder="Search events..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="flex-1 px-4 py-2.5 rounded-md bg-white/[0.04] border border-white/10 text-sm placeholder:text-slate-500 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition"
    />

    {/* FILTER (SECONDARY) */}
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsFilterOpen((p) => !p)}
        className="px-4 py-2.5 rounded-md border border-white/10 bg-transparent text-sm text-slate-400 hover:text-white hover:border-white/20 transition flex items-center"
      >
        <span>Filter</span>
        {selectedTags.length > 0 && (
          <span className="ml-2 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[11px] font-medium rounded-full bg-white text-black">
            {selectedTags.length}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {isFilterOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-white/10 rounded-md shadow-xl z-50">

          {/* HEADER */}
          <div className="px-4 py-3 border-b border-white/10 text-xs text-slate-400 uppercase tracking-wide">
            Categories
          </div>

          {/* OPTIONS */}
          <div className="py-2">
            {ALL_TAGS.map(tag => {
              const selected = selectedTags.includes(tag);

              return (
                <button
                  key={tag}
                  onClick={() =>
                    setSelectedTags(prev =>
                      selected
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    )
                  }
                  className={`w-full text-left px-4 py-2 text-sm transition
                    ${
                      selected
                        ? "bg-white/10 text-white"
                        : "text-slate-400 hover:bg-white/[0.05]"
                    }
                  `}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          {/* FOOTER */}
          <div className="border-t border-white/10 p-2">
            <button
              onClick={() => {
                setSelectedTags([]);
                setPage(1);
              }}
              className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-white/[0.05] rounded"
            >
              Clear filters
            </button>
          </div>

        </div>
      )}
    </div>

  </div>

</div>

{selectedTags.length > 0 && (
  <div className="flex gap-2 mb-4 flex-wrap">
    {selectedTags.map(tag => (
      <span
        key={tag}
        className="px-2.5 py-1 text-xs rounded-full bg-white/10 border border-white/10"
      >
        {tag}
      </span>
    ))}
  </div>
)}

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