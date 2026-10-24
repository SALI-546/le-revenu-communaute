const lines = [
  'h-3 w-1/4',
  'h-8 w-4/5',
  'h-8 w-3/5',
  'h-3 w-1/3',
  'h-3 w-full',
  'h-3 w-full',
  'h-3 w-2/3',
];

export function DiscussionDetailSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_286px]"
    >
      <div className="grid gap-4 rounded-xl border border-line bg-glass-strong p-8">
        {lines.map((line) => (
          <span
            key={line}
            className={`animate-pulse rounded-md bg-surface-2 ${line}`}
          />
        ))}
      </div>
      <div className="hidden h-40 animate-pulse rounded-xl bg-surface-2 xl:block" />
    </div>
  );
}
