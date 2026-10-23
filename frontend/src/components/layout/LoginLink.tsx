import Link from 'next/link';
import { UserCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { buttonStyles } from '@/components/ui/buttonStyles';

type LoginLinkProps = { href: string; label: string };

export function LoginLink({ href, label }: LoginLinkProps) {
  return (
    <Link
      href={href}
      className={buttonStyles({
        variant: 'ghost',
        className: 'max-lg:w-11 max-lg:px-0',
      })}
    >
      <HugeiconsIcon
        icon={UserCircleIcon}
        size={20}
        color="currentColor"
        aria-hidden="true"
        className="lg:hidden"
      />
      <span className="max-lg:sr-only">{label}</span>
    </Link>
  );
}
