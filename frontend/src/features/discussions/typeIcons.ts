import { HelpCircleIcon, Message01Icon } from '@hugeicons/core-free-icons';
import type { DiscussionType } from './types';

export const TYPE_ICONS = {
  question: HelpCircleIcon,
  discussion: Message01Icon,
} satisfies Record<DiscussionType, unknown>;
