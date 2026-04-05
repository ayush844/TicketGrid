export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 pt-28 flex justify-center">
      <div className="w-full max-w-3xl space-y-6 animate-pulse">

        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-800 rounded"></div>
          <div className="h-4 w-64 bg-slate-800 rounded"></div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="h-5 w-32 bg-slate-800 rounded"></div>

          <div className="space-y-2">
            <div className="h-4 w-24 bg-slate-800 rounded"></div>
            <div className="h-10 w-full bg-slate-800 rounded-xl"></div>
          </div>

          <div className="space-y-2">
            <div className="h-4 w-24 bg-slate-800 rounded"></div>
            <div className="h-24 w-full bg-slate-800 rounded-xl"></div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="h-5 w-40 bg-slate-800 rounded"></div>

          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-slate-800 rounded-xl"></div>
            <div className="h-10 bg-slate-800 rounded-xl"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-slate-800 rounded-xl"></div>
            <div className="h-10 bg-slate-800 rounded-xl"></div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="h-5 w-24 bg-slate-800 rounded"></div>

          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 w-20 bg-slate-800 rounded-full"></div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="h-5 w-28 bg-slate-800 rounded"></div>

          <div className="h-10 w-full bg-slate-800 rounded-xl"></div>

          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-slate-800 rounded-xl"></div>
            <div className="h-10 bg-slate-800 rounded-xl"></div>
          </div>

          <div className="h-10 w-full bg-slate-800 rounded-xl"></div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="h-5 w-32 bg-slate-800 rounded"></div>
          <div className="h-52 w-full bg-slate-800 rounded-2xl"></div>
        </div>

        <div className="h-12 w-full bg-slate-800 rounded-xl"></div>

      </div>
    </main>
  );
}