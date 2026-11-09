import clsx from 'clsx';

type LogoProps = { alt: string; withTagline?: boolean; className?: string };

// Démo publique : logo texte d'une marque fictive (la maquette d'origine reste sur main).
export function Logo({ alt, withTagline = true, className }: LogoProps) {
  return (
    <span
      {...(alt ? { role: 'img', 'aria-label': alt } : { 'aria-hidden': true })}
      className={clsx('inline-flex flex-col font-serif font-bold leading-[0.95] tracking-tight', className)}
    >
      <span className="text-[1.05rem] sm:text-[1.2rem]">Patrimoine</span>
      <span className="text-[1.05rem] text-[#c8102e] sm:text-[1.2rem]">Hebdo</span>
      {withTagline && (
        <span className="mt-1 font-sans text-[0.6rem] font-medium uppercase tracking-[0.16em] opacity-70">
          Communauté
        </span>
      )}
    </span>
  );
}
