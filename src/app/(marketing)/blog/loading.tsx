export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Breadcrumbs skeleton */}
      <div className="mb-4 h-4 w-40 animate-pulse rounded-md bg-muted" />

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3">
          <div className="h-9 w-72 animate-pulse rounded-lg bg-muted sm:w-96" />
          <div className="h-4 w-full max-w-xl animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-3/4 max-w-lg animate-pulse rounded-md bg-muted" />
        </div>
        {/* Search bar skeleton */}
        <div className="h-9 w-full animate-pulse rounded-md bg-muted sm:w-72" />
      </div>

      {/* Category filter badges */}
      <div className="mb-8 flex flex-wrap gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="h-6 animate-pulse rounded-full bg-muted"
            style={{ width: `${60 + i * 10}px` }}
          />
        ))}
      </div>

      {/* Featured post skeleton */}
      <div className="mb-10 overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="grid lg:grid-cols-2">
          {/* Image side */}
          <div className="aspect-[16/9] animate-pulse bg-muted lg:aspect-auto lg:min-h-[320px]" />
          {/* Content side */}
          <div className="flex flex-col gap-4 p-6 sm:p-8">
            <div className="h-5 w-24 animate-pulse rounded-full bg-muted" />
            <div className="flex flex-col gap-2">
              <div className="h-7 w-full animate-pulse rounded-lg bg-muted" />
              <div className="h-7 w-3/4 animate-pulse rounded-lg bg-muted" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded-md bg-muted" />
            </div>
            <div className="mt-auto flex items-center gap-3">
              <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-1 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-20 animate-pulse rounded-md bg-muted" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content + sidebar */}
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Post grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
              {/* Post image */}
              <div className="aspect-[16/9] animate-pulse bg-muted" />
              {/* Post content */}
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="h-4 w-20 animate-pulse rounded-full bg-muted" />
                <div className="flex flex-col gap-2">
                  <div className="h-5 w-full animate-pulse rounded-md bg-muted" />
                  <div className="h-5 w-4/5 animate-pulse rounded-md bg-muted" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="h-3.5 w-full animate-pulse rounded-md bg-muted" />
                  <div className="h-3.5 w-full animate-pulse rounded-md bg-muted" />
                  <div className="h-3.5 w-1/2 animate-pulse rounded-md bg-muted" />
                </div>
                <div className="mt-auto flex items-center gap-2 pt-1">
                  <div className="h-3.5 w-16 animate-pulse rounded-md bg-muted" />
                  <div className="h-3.5 w-16 animate-pulse rounded-md bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar skeleton */}
        <div className="flex flex-col gap-6">
          {/* Categories widget */}
          <div className="flex flex-col gap-3 rounded-xl border bg-card p-5">
            <div className="h-5 w-28 animate-pulse rounded-md bg-muted" />
            <div className="flex flex-col gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
                  <div className="h-4 w-8 animate-pulse rounded-md bg-muted" />
                </div>
              ))}
            </div>
          </div>

          {/* Popular posts widget */}
          <div className="flex flex-col gap-3 rounded-xl border bg-card p-5">
            <div className="h-5 w-28 animate-pulse rounded-md bg-muted" />
            <div className="flex flex-col gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-14 w-14 flex-shrink-0 animate-pulse rounded-lg bg-muted" />
                  <div className="flex flex-col gap-1.5">
                    <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
                    <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted" />
                    <div className="h-3 w-16 animate-pulse rounded-md bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags widget */}
          <div className="flex flex-col gap-3 rounded-xl border bg-card p-5">
            <div className="h-5 w-12 animate-pulse rounded-md bg-muted" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-6 animate-pulse rounded-full bg-muted"
                  style={{ width: `${50 + (i % 4) * 15}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
