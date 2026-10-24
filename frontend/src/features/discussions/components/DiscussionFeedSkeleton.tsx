const lines = ['w-1/4', 'h-[18px] w-3/4', 'w-full', 'w-1/2'];

export function DiscussionFeedSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="grid gap-6 lg:grid-cols-[205px_minmax(0,1fr)] lg:gap-7"
    >
      <div className="flex gap-2 overflow-hidden lg:grid lg:content-start lg:gap-1">
        {[1, 2, 3, 4].map((item) => (
          <span
            key={item}
            className="h-11 w-28 animate-pulse rounded-full bg-surface-2 lg:w-full lg:rounded-lg"
          />
        ))}
      </div>
      <div className="bg-glass">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="grid grid-cols-[62px_1fr] gap-5 border-b border-line px-5 py-6"
          >
            <span className="size-[62px] animate-pulse rounded-xl bg-surface-2" />
            <div className="grid content-center gap-2.5">
              {lines.map((line) => (
                <span
                  key={line}
                  className={`h-2.5 animate-pulse rounded-md bg-surface-2 ${line}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
