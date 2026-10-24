import Image from 'next/image';
import clsx from 'clsx';

type LogoProps = { alt: string; withTagline?: boolean; className?: string };

export function Logo({ alt, withTagline = true, className }: LogoProps) {
  const compact = (
    <Image
      src="/brand/logo.webp"
      alt={alt}
      width={645}
      height={192}
      className={clsx('h-auto', withTagline && 'hidden dark:block', className)}
    />
  );

  if (!withTagline) {
    return compact;
  }
  return (
    <>
      <Image
        src="/brand/logo-with-text.webp"
        alt={alt}
        width={645}
        height={246}
        className={clsx('h-auto dark:hidden', className)}
      />
      {compact}
    </>
  );
}
