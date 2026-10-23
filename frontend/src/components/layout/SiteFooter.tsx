import { getDictionary } from '@/dictionaries';
import { Logo } from './Logo';

export async function SiteFooter() {
  const { layout } = await getDictionary();

  return (
    <footer className="border-t border-line bg-surface">
      <div className="page-shell flex flex-col items-start gap-4 py-8 sm:flex-row sm:items-center sm:gap-6">
        <Logo />
        <p className="text-xs text-ink-3">{layout.footer.tagline}</p>
      </div>
    </footer>
  );
}
