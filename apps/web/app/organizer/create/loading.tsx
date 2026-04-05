
export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-950 text-white pt-28 pb-16 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl p-10 space-y-8 animate-pulse">

        <div className="space-y-3">
          <div className="h-8 w-48 bg-slate-800 rounded-md" />
          <div className="h-4 w-72 bg-slate-800 rounded-md" />
        </div>

        <div className="space-y-6">

          <div className="space-y-2">
            <div className="h-4 w-24 bg-slate-800 rounded" />
            <div className="h-12 w-full bg-slate-800 rounded-xl" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-32 bg-slate-800 rounded" />
            <div className="h-24 w-full bg-slate-800 rounded-xl" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-slate-800 rounded-xl" />
            <div className="h-12 bg-slate-800 rounded-xl" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-slate-800 rounded-xl" />
            <div className="h-12 bg-slate-800 rounded-xl" />
          </div>

          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-20 bg-slate-800 rounded-full"
              />
            ))}
          </div>

          <div className="space-y-4">
            <div className="h-6 w-32 bg-slate-800 rounded" />
            <div className="h-12 w-full bg-slate-800 rounded-xl" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-slate-800 rounded-xl" />
              <div className="h-12 bg-slate-800 rounded-xl" />
            </div>
            <div className="h-12 w-full bg-slate-800 rounded-xl" />
            <div className="h-12 w-full bg-slate-800 rounded-xl" />
          </div>

          <div className="h-12 w-full bg-slate-800 rounded-xl" />

          <div className="h-12 w-full bg-slate-800 rounded-xl" />
        </div>
      </div>
    </main>
  );
}