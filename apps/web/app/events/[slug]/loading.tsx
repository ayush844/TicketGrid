export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 animate-pulse">

      <div className="h-[500px] bg-slate-800" />

      <div className="max-w-6xl mx-auto px-4 mt-10 grid md:grid-cols-3 gap-10">

        <div className="md:col-span-2 space-y-6">
          <div className="h-10 bg-slate-800 rounded w-2/3" />
          <div className="h-6 bg-slate-800 rounded w-1/2" />
          <div className="h-6 bg-slate-800 rounded w-1/3" />

          <div className="h-40 bg-slate-800 rounded" />
        </div>

        <div className="h-60 bg-slate-800 rounded-2xl" />
      </div>
    </div>
  );
}