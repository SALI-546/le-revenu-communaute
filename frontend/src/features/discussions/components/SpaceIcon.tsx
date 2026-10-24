import clsx from 'clsx';
import {
  Building03Icon,
  ChartCandlestickIcon,
  Coffee01Icon,
  DiamondIcon,
  Globe02Icon,
  Invoice01Icon,
  PiggyBankIcon,
  Sofa01Icon,
  UmbrellaIcon,
  UserGroupIcon,
  Wallet01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { SPACE_COLORS } from '../spaceColors';
import type { SpaceColor, SpaceIconName } from '../types';

const ICONS = {
  chart: ChartCandlestickIcon,
  globe: Globe02Icon,
  'piggy-bank': PiggyBankIcon,
  umbrella: UmbrellaIcon,
  building: Building03Icon,
  invoice: Invoice01Icon,
  sofa: Sofa01Icon,
  family: UserGroupIcon,
  diamond: DiamondIcon,
  wallet: Wallet01Icon,
  coffee: Coffee01Icon,
} satisfies Record<SpaceIconName, unknown>;

const SIZES = {
  sm: { box: 'size-[26px] rounded-[7px]', icon: 15 },
  md: { box: 'size-10 rounded-[11px]', icon: 22 },
  lg: { box: 'size-14 rounded-[15px]', icon: 30 },
};

type SpaceIconProps = {
  icon: SpaceIconName;
  color: SpaceColor;
  size?: keyof typeof SIZES;
};

export function SpaceIcon({ icon, color, size = 'sm' }: SpaceIconProps) {
  return (
    <span
      aria-hidden="true"
      className={clsx(
        'inline-grid flex-none place-items-center text-on-brand shadow-sm',
        SPACE_COLORS[color],
        SIZES[size].box,
      )}
    >
      <HugeiconsIcon
        icon={ICONS[icon]}
        size={SIZES[size].icon}
        color="currentColor"
        strokeWidth={2}
      />
    </span>
  );
}
