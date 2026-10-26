import { getDictionary } from '@/dictionaries';

export async function generateMetadata() {
  const { charter } = await getDictionary();
  return { title: charter.title };
}

export default async function CharterPage() {
  const { charter } = await getDictionary();

  return (
    <main id="content" className="max-w-3xl pt-8 pb-24">
      <header className="mb-7">
        <h1 className="font-display text-[clamp(1.75rem,3vw,2.25rem)] font-bold text-heading">
          {charter.title}
        </h1>
        <p className="mt-2 text-ink-2">{charter.description}</p>
      </header>
      <ol className="grid gap-3">
        {charter.rules.map(({ title, text }, index) => (
          <li
            key={title}
            className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3 rounded-xl border border-l-[6px] border-line border-l-brand bg-surface p-4 pl-5"
          >
            <span
              aria-hidden="true"
              className="font-display text-3xl leading-none font-black text-brand-text"
            >
              {index + 1}
            </span>
            <div>
              <h2 className="font-semibold text-ink">{title}</h2>
              <p className="mt-0.5 text-base text-ink-2">{text}</p>
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}
