import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { defaultLocale, locales, type Locale } from './config';
import { nestMessages } from './nestMessages';
import { detectPreferredLocale } from './languageDetection';
import { getEnabledFeatures } from '@/lib/communities/config-env';

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

/**
 * Extract communityId from URL path (first segment after /)
 * This is used for server-side i18n configuration
 */
function extractCommunityIdFromPath(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) {
    return null;
  }
  const firstSegment = segments[0];
  // Skip if it's a known non-community path
  if (['api', '_next', 'favicon.ico', 'login', 'sign-up'].includes(firstSegment)) {
    return null;
  }
  return firstSegment;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get('language')?.value;
  
  let locale: Locale;
  
  if (savedLocale && locales.includes(savedLocale as Locale)) {
    locale = savedLocale as Locale;
  } else {
    // Try to extract communityId from URL path via x-community-id header or referer
    const headersList = await headers();
    const communityIdHeader = headersList.get('x-community-id');
    const referer = headersList.get('referer');
    
    let communityId: string | null = communityIdHeader;
    if (!communityId && referer) {
      try {
        const url = new URL(referer);
        communityId = extractCommunityIdFromPath(url.pathname);
      } catch {
        // Invalid referer URL, ignore
      }
    }
    
    // Default to 'default' if no communityId found
    const effectiveCommunityId = communityId || 'default';
    const enabledFeatures = await getEnabledFeatures(effectiveCommunityId);
    const hasLanguageSwitcher = enabledFeatures.includes('languageSwitcher');
    
    if (hasLanguageSwitcher) {
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
