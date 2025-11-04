import { Locale, locales, defaultLocale } from './config';

interface ParsedLanguage {
  code: string;
  quality: number;
}

function parseAcceptLanguage(acceptLanguage: string | null): ParsedLanguage[] {
  if (!acceptLanguage) {
    return [];
  }

  return acceptLanguage
    .split(',')
    .map(lang => {
      const [code, qValue] = lang.trim().split(';');
      const quality = qValue ? parseFloat(qValue.split('=')[1]) : 1.0;
      const langCode = code.split('-')[0].toLowerCase();
      return { code: langCode, quality };
    })
    .sort((a, b) => b.quality - a.quality);
}

export function detectPreferredLocale(
  acceptLanguage: string | null,
  supportedLocales: readonly Locale[] = locales,
  fallbackLocale: Locale = defaultLocale
): Locale {
  const parsedLanguages = parseAcceptLanguage(acceptLanguage);
  
  if (parsedLanguages.length === 0) {
    return fallbackLocale;
  }

  for (const { code } of parsedLanguages) {
    const matchedLocale = supportedLocales.find(locale => locale === code);
    if (matchedLocale) {
      return matchedLocale;
    }
  }

  return fallbackLocale;
}
