export default function AppLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page title skeleton */}
      <div className="mb-8 flex flex-col gap-2">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded-md bg-muted" />
      </div>

      {/* Stats row */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm">
            <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
            <div className="h-8 w-16 animate-pulse rounded-lg bg-muted" />
            <div className="h-3 w-20 animate-pulse rounded-md bg-muted" />
          </div>
        ))}
      </div>

      {/* Main content area */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Primary panel */}
        <div className="flex flex-col gap-6">
          {/* Section header */}
          <div className="flex items-center justify-between">
            <div className="h-5 w-36 animate-pulse rounded-md bg-muted" />
            <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
          </div>

          {/* Content cards */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 rounded-xl border bg-card p-5 shadow-sm">
              <div className="h-12 w-12 flex-shrink-0 animate-pulse rounded-xl bg-muted" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="h-5 w-48 animate-pulse rounded-md bg-muted" />
                  <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
                </div>
                <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
                <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted" />
                <div className="mt-1 h-3.5 w-28 animate-pulse rounded-md bg-muted" />
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar panel */}
        <div className="flex flex-col gap-6">
          {/* Upcoming / quick actions */}
          <div className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm">
            <div className="h-5 w-32 animate-pulse rounded-md bg-muted" />
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-8 w-8 flex-shrink-0 animate-pulse rounded-lg bg-muted" />
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
                    <div className="h-3 w-20 animate-pulse rounded-md bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Secondary card */}
          <div className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm">
            <div className="h-5 w-24 animate-pulse rounded-md bg-muted" />
            <div className="aspect-video w-full animate-pulse rounded-lg bg-muted" />
            <div className="flex flex-col gap-2">
              <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted" />
            </div>
            <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
