const lines = ['w-1/4', 'h-[18px] w-3/4', 'w-full', 'w-1/2'];

export function DiscussionFeedSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-xl border border-line bg-surface"
    >
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="grid grid-cols-[62px_1fr] gap-5 border-b border-line px-5 py-6 last:border-b-0"
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
  );
}
