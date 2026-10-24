const UNITS = [
  ['year', 31_536_000],
  ['month', 2_592_000],
  ['week', 604_800],
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60],
] as const;

export const formatRelative = (locale: string, iso: string, now: number) => {
  const seconds = (Date.parse(iso) - now) / 1000;
  const format = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const match = UNITS.find(([, size]) => Math.abs(seconds) >= size);
  return match
    ? format.format(Math.round(seconds / match[1]), match[0])
    : format.format(0, 'second');
};
