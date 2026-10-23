import clsx from 'clsx';

const COLORS = [
  'bg-avatar-violet',
  'bg-avatar-teal',
  'bg-avatar-gray',
  'bg-avatar-orange',
  'bg-avatar-pink',
];

const SIZES = {
  sm: 'size-[25px] text-[8px]',
  md: 'size-[38px] text-[10px]',
  lg: 'size-12 text-xs',
};

const colorFor = (name: string) =>
  COLORS[
    [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) % COLORS.length
  ];

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');

type AvatarProps = { name: string; size?: keyof typeof SIZES };

export function Avatar({ name, size = 'md' }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={clsx(
        'inline-grid flex-none place-items-center rounded-full font-bold text-on-brand',
        colorFor(name),
        SIZES[size],
      )}
    >
      {initialsOf(name)}
    </span>
  );
}
