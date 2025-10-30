import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useHeaderConfig } from '@/contexts/HeaderContext';
import { TranslationKey } from '@/types/i18n';

interface I18nHeaderConfig {
  titleKey: TranslationKey;
  showBackButton?: boolean;
  showLogo?: boolean;
  backTo?: string;
}

/**
 * Hook to configure header with i18n support
 * 
 * @example
 * ```tsx
 * useI18nHeader({
 *   titleKey: 'wallets.overview.headerTitle',
 *   showBackButton: true,
 *   backTo: '/users/me'
 * });
 * ```
 */
export function useI18nHeader(config: I18nHeaderConfig) {
  const t = useTranslations();
  
  const headerConfig = useMemo(
    () => ({
      title: t(config.titleKey),
      showBackButton: config.showBackButton ?? false,
      showLogo: config.showLogo ?? false,
      backTo: config.backTo,
    }),
    [t, config.titleKey, config.showBackButton, config.showLogo, config.backTo],
  );
  
  useHeaderConfig(headerConfig);
}
