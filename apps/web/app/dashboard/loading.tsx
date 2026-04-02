export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 px-6">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="h-8 w-48 bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-64 bg-white/10 rounded animate-pulse" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>

      </div>
    </div>
  );
}