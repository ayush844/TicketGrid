
import BookingSection from "@/components/BookingSection";
import { callBackend } from "@/lib/protectedApi";

const Dashboard = async () => {
  const data = await callBackend("/api/user/bookings");
  const upcoming = data?.upcoming || [];
  const past = data?.past || [];

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-10  pt-28 pb-16">
      <div className="max-w-6xl mx-auto space-y-10">
    <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          My Bookings
        </h1>
        <p className="text-sm text-blue-200/60 mt-1">
          Manage and view your event tickets
        </p>
    </div>

    <BookingSection
      title="Upcoming Events"
      bookings={upcoming}
      emptyText="No upcoming bookings"
    />

    <BookingSection
      title="Past Events"
      bookings={past}
      emptyText="No past bookings"
    />

      </div>
    </main>
  );
}


export default Dashboard;