import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { defaultLocale, locales, type Locale } from './config';
import { nestMessages } from './nestMessages';
import { detectPreferredLocale } from './languageDetection';
import { getCommunityIdFromEnv, getEnabledFeatures } from '@/lib/communities/config-env';

/**
 * メッセージをマージ（メモ化付き）
 */
const messagesCache = new Map<string, any>();

async function loadMessages(locale: Locale, namespaces: string[]) {
  const cacheKey = `${locale}-${namespaces.join(',')}`;
  
  if (messagesCache.has(cacheKey)) {
    return messagesCache.get(cacheKey);
  }

  const flatMessages: Record<string, string> = {};

  for (const namespace of namespaces) {
    try {
      const namespaceMessages = (await import(`@/messages/${locale}/${namespace}.json`)).default;
      Object.assign(flatMessages, namespaceMessages);
    } catch (error) {
      console.warn(`Failed to load ${locale}/${namespace}.json`);
    }
  }

  const messages = nestMessages(flatMessages);
  messagesCache.set(cacheKey, messages);
  return messages;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get('language')?.value;
  
  let locale: Locale;
  
  if (savedLocale && locales.includes(savedLocale as Locale)) {
    locale = savedLocale as Locale;
  } else {
    const communityId = getCommunityIdFromEnv();
    const enabledFeatures = await getEnabledFeatures(communityId);
    const hasLanguageSwitcher = enabledFeatures.includes('languageSwitcher');
    
    if (hasLanguageSwitcher) {
      const headersList = await headers();
      const acceptLanguage = headersList.get('accept-language');
      locale = detectPreferredLocale(acceptLanguage, locales, defaultLocale);
    } else {
      locale = defaultLocale;
    }
  }

  const namespaces = ['common', 'navigation', 'wallets', 'transactions', 'users', 'auth', 'phoneVerification', 'search', 'adminWallet', 'adminBonuses'];
  const messages = await loadMessages(locale, namespaces);

  return {
    locale,
    messages,
  };
});
