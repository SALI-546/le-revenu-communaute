import { getDictionary } from '@/dictionaries';
import { buttonStyles } from '@/components/ui/buttonStyles';
import { Logo } from './Logo';
import { SITE_SECTIONS, SITE_URL, SUBSCRIBE_URL } from './siteLinks';

export async function SiteFooter() {
  const { layout } = await getDictionary();
  const { footer } = layout;

  return (
    <footer className="bg-linear-to-t from-hero via-hero to-hero-2 text-hero-ink">
      <div className="page-shell grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <nav aria-labelledby="footer-sections">
          <h2
            id="footer-sections"
            className="mb-4 text-base font-semibold text-on-hero"
          >
            {footer.sectionsTitle}
          </h2>
          <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2 xl:grid-cols-3">
            {SITE_SECTIONS.map(({ key, path }) => (
              <li key={key}>
                <a
                  href={`${SITE_URL}${path}`}
                  className="inline-flex min-h-11 items-center text-sm hover:text-on-hero"
                >
                  {footer.sections[key]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="grid justify-items-start gap-4 lg:max-w-xs lg:justify-items-end lg:text-right">
          <p className="text-sm">{footer.subscribePitch}</p>
          <a
            href={SUBSCRIBE_URL}
            className={buttonStyles({ className: 'uppercase' })}
          >
            {layout.subscribe}
          </a>
        </div>
      </div>
      <div className="border-t border-hero-2">
        <div className="page-shell flex flex-col items-start gap-3 py-6 sm:flex-row sm:items-center sm:gap-6">
          <Logo alt={layout.logoAlt} withTagline={false} className="w-24" />
          <p className="text-xs">{footer.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
