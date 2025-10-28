import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { defaultLocale, locales, type Locale } from './config';

/**
 * ルートごとに必要な namespace を判定
 */
function getNamespacesForPath(pathname: string): string[] {
  const namespaces = ['common']; // 常に common は含める

  if (pathname.startsWith('/wallets')) {
    namespaces.push('wallets', 'transactions');
  } else if (pathname.startsWith('/users')) {
    namespaces.push('users');
  } else if (pathname.startsWith('/login') || pathname.startsWith('/sign-up')) {
    namespaces.push('auth');
  }

  return namespaces;
}

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

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get('language')?.value;
  
  const locale: Locale = 
    savedLocale && locales.includes(savedLocale as Locale)
      ? (savedLocale as Locale)
      : defaultLocale;

  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';

  const namespaces = getNamespacesForPath(pathname);
  const messages = await loadMessages(locale, namespaces);

  return {
    locale,
    messages,
  };
});
