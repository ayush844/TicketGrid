import { callBackend } from "@/lib/protectedApi";
import { notFound } from "next/navigation";

export default async function EventStatsPage({ params }: any) {
  const { id } = await params;

  const data = await callBackend(
    `/api/organizer/events/${id}/stats`
  );

  if(!data){
    notFound()
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            {data.title}
          </h1>
          <p className="text-sm text-slate-400">
            Event performance overview
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card label="Revenue" value={`₹${data.revenue}`} />
          <Card label="Tickets Sold" value={data.totalTickets} />
          <Card label="Bookings" value={data.totalBookings} />
          <Card label="Remaining" value={data.remainingTickets} />
        </div>

        {/* Recent Bookings */}
        <section className="border border-white/10 rounded-lg bg-slate-900/40 overflow-hidden">

          {/* Header */}
          <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-sm font-medium text-white">
              Recent Bookings
            </h2>
            <span className="text-xs text-slate-400">
              {data.recentBookings.length} entries
            </span>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500 uppercase tracking-wide border-b border-white/10">
                <tr>
                  <th className="px-5 py-3 text-left font-medium">User</th>
                  <th className="py-3 text-left font-medium">Tickets</th>
                  <th className="py-3 text-left font-medium">Amount</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {data.recentBookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center py-10 text-sm text-slate-400"
                    >
                      No bookings yet
                    </td>
                  </tr>
                ) : (
                  data.recentBookings.map((b: any) => (
                    <tr key={b.id} className="hover:bg-white/5 transition">
                      <td className="px-5 py-4 text-white">
                        {b.user.email}
                      </td>
                      <td className="text-slate-300">
                        {b.quantity}
                      </td>
                      <td className="text-white font-medium">
                        ₹{b.totalAmount}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="md:hidden divide-y divide-white/10">
            {data.recentBookings.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-400">
                No bookings yet
              </div>
            ) : (
              data.recentBookings.map((b: any) => (
                <div key={b.id} className="p-4 space-y-2">
                  <p className="text-sm text-white">
                    {b.user.email}
                  </p>

                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{b.quantity} tickets</span>
                    <span className="text-white">
                      ₹{b.totalAmount}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

        </section>

      </div>
    </main>
  );
}

const Card = ({ label, value }: any) => (
  <div className="border border-white/10 rounded-lg bg-slate-900/40 p-4">
    <p className="text-xs text-slate-400">{label}</p>
    <h2 className="text-xl sm:text-2xl font-semibold text-white mt-1">
      {value}
    </h2>
  </div>
);