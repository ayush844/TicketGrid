import BookingTicketCard from "./BookingTicketCard";


type Props = {
  title: string;
  bookings: any[];
  emptyText: string;
};

const BookingSection = ({ title, bookings, emptyText }: Props) => {
  return (
    <section className="space-y-5">
  <div className="flex items-center justify-between">
    <h2 className="text-lg font-semibold text-white">
      {title}
    </h2>

    <span className="text-xs text-blue-300/50">
      {bookings.length} events
    </span>
  </div>

  {bookings.length === 0 ? (
    <div className="border border-white/10 rounded-xl p-6 text-center text-sm text-slate-400 bg-white/5">
      {emptyText}
    </div>
  ) : (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookings.map((booking) => (
        <BookingTicketCard key={booking.id} booking={booking} />
      ))}
    </div>
  )}
</section>
  );
};

export default BookingSection;