type Props = {
  stats: {
    totalEvents: number;
    totalRevenue: number;
    totalTicketsSold: number;
    upcomingEvents: number;
  };
};

const StatsCards = ({ stats }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <Card title="Total Events" value={stats.totalEvents} />
      <Card title="Revenue" value={`₹${stats.totalRevenue}`} />
      <Card title="Tickets Sold" value={stats.totalTicketsSold} />
      <Card title="Upcoming" value={stats.upcomingEvents} />
    </div>
  );
};

const Card = ({ title, value }: any) => (
  <div className="border border-white/10 rounded-lg bg-white/5 p-4 sm:p-5">
    <p className="text-xs text-slate-400">{title}</p>
    <h2 className="text-xl sm:text-2xl font-semibold text-white mt-2">
      {value}
    </h2>
  </div>
);

export default StatsCards;