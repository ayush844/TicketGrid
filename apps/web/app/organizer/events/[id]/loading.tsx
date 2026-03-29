export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-950 text-white pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Header */}
        <div className="space-y-2">
          <div className="h-8 w-72 bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-48 bg-white/10 rounded animate-pulse" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-white/10 rounded-lg animate-pulse"
            />
          ))}
        </div>

        {/* Bookings */}
        <section className="border border-white/10 rounded-lg bg-slate-900/40 overflow-hidden">

          {/* Header */}
          <div className="px-5 py-4 border-b border-white/10 flex justify-between">
            <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
            <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
          </div>

          {/* Rows */}
          <div className="space-y-2 p-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-10 bg-white/5 rounded animate-pulse"
              />
            ))}
          </div>

        </section>

      </div>
    </main>
  );
}