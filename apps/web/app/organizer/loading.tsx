export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-950 text-white pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-12">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-80 bg-white/10 rounded animate-pulse" />
          </div>

          <div className="h-10 w-40 bg-white/10 rounded animate-pulse" />
        </div>

        <section className="border border-white/10 rounded-xl bg-white/5 p-5">
          <div className="h-4 w-24 bg-white/10 rounded animate-pulse mb-4" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-white/10 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </section>

        <section className="border border-white/10 rounded-xl bg-white/5 p-5">
          <div className="flex justify-between mb-4">
            <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
            <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
          </div>

          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-12 bg-white/5 rounded animate-pulse"
              />
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}