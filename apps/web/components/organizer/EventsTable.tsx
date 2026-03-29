import Link from "next/link";
import ActionButton from "./ActionButton";

type Props = {
  events: any[];
};

const EventsTable = ({ events }: Props) => {

  if (!events || events.length === 0) {
    return (
      <div className="border border-white/10 rounded-lg bg-slate-900/40 p-8 text-center">
        <p className="text-sm text-slate-400">
          No events created yet
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Create your first event to get started
        </p>
      </div>
    );
  }

  return (
    <div className="border border-white/10 rounded-lg bg-slate-900/40 overflow-hidden">

      {/* 🖥️ DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">

          <thead className="border-b border-white/10 bg-slate-900/60">
            <tr className="text-slate-400 text-xs uppercase tracking-wide">
              <th className="px-6 py-3 text-left font-medium">Event</th>
              <th className="px-6 py-3 text-left font-medium">Status</th>
              <th className="px-6 py-3 text-left font-medium">Tickets</th>
              <th className="px-6 py-3 text-left font-medium">Date</th>
              <th className="px-6 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => (
              <tr
                key={event.id}
                className="border-t border-white/5 hover:bg-white/5 transition"
              >
                <td className="px-6 py-4 text-white font-medium">
                  {event.title}
                </td>

                <td className="px-6 py-4">
                  <StatusBadge event={event} />
                </td>

                <td className="px-6 py-4 text-slate-300">
                  {event.ticketsSold}
                  <span className="text-slate-500">
                    {" "} / {event.capacity}
                  </span>
                </td>

                <td className="px-6 py-4 text-slate-400">
                  {new Date(event.startTime).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 text-right space-x-3">

                <Link
                    href={`/organizer/events/${event.id}`}
                    className="text-xs text-slate-300 hover:text-white"
                >
                    View
                </Link>

                {!event.isPublished && (
                    <ActionButton
                    label="Publish"
                    endpoint={`/events/${event.id}/publish`}
                    color="green"
                    />
                )}

                <ActionButton
                    label="Delete"
                    endpoint={`/events/${event.id}/delete`}
                    color="red"
                />

                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* 📱 MOBILE VIEW */}
      <div className="md:hidden divide-y divide-white/10">
        {events.map((event) => (
          <div key={event.id} className="p-4 space-y-3">

            <div className="flex justify-between items-start gap-2">
              <h3 className="text-sm font-medium text-white leading-snug">
                {event.title}
              </h3>
              <StatusBadge event={event} />
            </div>

            <div className="flex justify-between text-xs text-slate-400">
              <span>
                {event.ticketsSold}/{event.capacity}
              </span>
              <span>
                {new Date(event.startTime).toLocaleDateString()}
              </span>
            </div>

            <Link
              href={`/organizer/events/${event.id}`}
              className="text-xs text-white hover:underline"
            >
              View details
            </Link>
            <div className="flex gap-3 text-xs mt-2">
                {!event.isPublished && (
                    <ActionButton
                    label="Publish"
                    endpoint={`/events/${event.id}/publish`}
                    color="green"
                    />
                )}

                <ActionButton
                    label="Delete"
                    endpoint={`/events/${event.id}/delete`}
                    color="red"
                />

                </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatusBadge = ({ event }: any) => {
  return (
    <span
      className={`text-xs px-2 py-1 rounded border ${
        event.isPublished
          ? "border-green-500/20 text-green-400"
          : "border-yellow-500/20 text-yellow-400"
      }`}
    >
      {event.status}
    </span>
  );
};

export default EventsTable;