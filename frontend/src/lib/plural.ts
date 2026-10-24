type PluralForms = { one: string; other: string };

export const pluralize = (locale: string, count: number, forms: PluralForms) =>
  forms[new Intl.PluralRules(locale).select(count) === 'one' ? 'one' : 'other'];
