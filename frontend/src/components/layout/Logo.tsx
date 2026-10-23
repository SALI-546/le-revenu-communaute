import clsx from 'clsx';

type LogoProps = { tone?: 'brand' | 'light' };

export function Logo({ tone = 'brand' }: LogoProps) {
  return (
    <span
      className={clsx(
        'flex items-start font-display text-xl leading-[0.85] font-black tracking-[-0.06em]',
        tone === 'brand' ? 'text-brand' : 'text-on-hero',
      )}
    >
      <small className="mr-[3px] font-sans text-[7px] font-extrabold tracking-[-0.05em]">
        LE
      </small>
      REVENU
    </span>
  );
}
