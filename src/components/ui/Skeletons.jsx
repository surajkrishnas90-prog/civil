export function CardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden animate-pulse">
      <div className="h-44 bg-slate-100" />
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-slate-100" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-100 rounded-full w-3/4" />
            <div className="h-3 bg-slate-100 rounded-full w-1/2" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-slate-100 rounded-full w-full" />
          <div className="h-3 bg-slate-100 rounded-full w-2/3" />
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-2xl bg-slate-100" />
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-slate-100 rounded-full w-1/2" />
          <div className="h-4 bg-slate-100 rounded-full w-1/3" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-slate-100 rounded-full" />
        <div className="h-4 bg-slate-100 rounded-full w-5/6" />
        <div className="h-4 bg-slate-100 rounded-full w-2/3" />
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <svg className="animate-spin h-10 w-10 text-brand-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-slate-400 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}
