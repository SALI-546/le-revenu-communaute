// Content is French: show Paris time whatever the server time zone (UTC in containers).
const TIME_ZONE = 'Europe/Paris';

export const formatDate = (
  locale: string,
  iso: string,
  options: Intl.DateTimeFormatOptions,
) =>
  new Intl.DateTimeFormat(locale, { ...options, timeZone: TIME_ZONE }).format(
    new Date(iso),
  );
