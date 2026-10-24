'use client';

import { useParams } from 'next/navigation';
import { Alert02Icon } from '@hugeicons/core-free-icons';
import { buttonStyles } from '@/components/ui/buttonStyles';
import { StateCard } from '@/components/ui/StateCard';
import en from '@/dictionaries/en.json';
import fr from '@/dictionaries/fr.json';

type CommunityErrorProps = { error: unknown; retry: () => void };

export default function CommunityError({ retry }: CommunityErrorProps) {
  const { lang } = useParams<{ lang: string }>();
  const { error } = (lang === 'en' ? en : fr).discussions.list;

  return (
    <div className="page-shell py-20">
      <StateCard
        icon={Alert02Icon}
        tone="error"
        title={error.title}
        description={error.description}
        action={
          <button
            type="button"
            onClick={retry}
            className={buttonStyles({ variant: 'secondary' })}
          >
            {error.retry}
          </button>
        }
      />
    </div>
  );
}
