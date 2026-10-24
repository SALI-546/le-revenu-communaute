import type { Metadata } from 'next';
import { Playfair_Display, Source_Sans_3 } from 'next/font/google';
import { lang } from 'next/root-params';
import { getDictionary } from '@/dictionaries';
import { locales } from '@/dictionaries/config';
import '@/styles/globals.css';

const sourceSans = Source_Sans_3({
  variable: '--font-source-sans',
  subsets: ['latin'],
});
const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
});

export async function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return {
    title: { default: meta.title, template: `%s · ${meta.title}` },
    description: meta.description,
  };
}

export default async function RootLayout({ children }: LayoutProps<'/[lang]'>) {
  const { layout } = await getDictionary();

  return (
    <html
      lang={await lang()}
      className={`${sourceSans.variable} ${playfair.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col font-sans">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-surface focus:p-3"
        >
          {layout.skipToContent}
        </a>
        {children}
      </body>
    </html>
  );
}
