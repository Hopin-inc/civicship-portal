import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { defaultLocale, locales, type Locale } from './config';

/**
 * メッセージをマージ（メモ化付き）
 */
const messagesCache = new Map<string, any>();

async function loadMessages(locale: Locale, namespaces: string[]) {
  const cacheKey = `${locale}-${namespaces.join(',')}`;
  
  if (messagesCache.has(cacheKey)) {
    return messagesCache.get(cacheKey);
  }

  const messages: Record<string, any> = {};

  for (const namespace of namespaces) {
    try {
      const namespaceMessages = (await import(`@/messages/${locale}/${namespace}.json`)).default;
      Object.assign(messages, namespaceMessages);
    } catch (error) {
      console.warn(`Failed to load ${locale}/${namespace}.json`);
    }
  }

  messagesCache.set(cacheKey, messages);
  return messages;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get('language')?.value;
  
  const locale: Locale = 
    savedLocale && locales.includes(savedLocale as Locale)
      ? (savedLocale as Locale)
      : defaultLocale;

  const namespaces = ['common', 'wallets', 'transactions', 'users', 'auth'];
  const messages = await loadMessages(locale, namespaces);

  return {
    locale,
    messages,
  };
});
