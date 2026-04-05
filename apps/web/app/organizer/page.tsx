import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { callBackend } from "@/lib/protectedApi";
import { ROLES } from "@/lib/constants";
import StatsCards from "@/components/organizer/StatsCards";
import EventsTable from "@/components/organizer/EventsTable";

export default async function OrganizerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/signin");
  if (session.user.role !== ROLES.ORGANIZER) redirect("/events");

  const stats = await callBackend("/api/organizer/dashboard");
  const eventsData = await callBackend("/api/organizer/events");

  return (
    <main className="min-h-screen bg-slate-950 text-white pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-12">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Organizer Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage your events and monitor performance
            </p>
          </div>

          <a
            href="/organizer/create"
            className="inline-flex items-center justify-center px-4 py-2 rounded-md 
              border border-white/10 bg-white/5 
              hover:bg-white/10 transition text-sm font-medium"
          >
            + Create Event
          </a>
        </div>

        <section className="border border-white/10 rounded-xl bg-white/5 p-5">
          <h2 className="text-sm font-medium text-slate-400 mb-4">
            Overview
          </h2>

          <StatsCards stats={stats} />
        </section>

        <section className="border border-white/10 rounded-xl bg-white/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-slate-400">
              Events
            </h2>
            <span className="text-xs text-slate-500">
              {eventsData.events.length} total
            </span>
          </div>

          <EventsTable events={eventsData.events} />
        </section>

      </div>
    </main>
  );
}