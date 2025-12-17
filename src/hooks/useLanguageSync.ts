import { useEffect, useRef } from "react";
import { useMutation } from "@apollo/client";
import { useFeatureCheck } from "@/hooks/useFeatureCheck";
import { UPDATE_MY_PROFILE } from "@/graphql/account/user/mutation";
import { GqlLanguage, GqlUser } from "@/types/graphql";
import { logger } from "@/lib/logging";

const getLanguageCookie = (): string | null => {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((c) => c.startsWith("language="));
  const [, ...cookieValues] = cookie?.split("=") ?? [];
  return cookieValues?.length ? cookieValues.join("=") : null;
};

const mapCookieToEnum = (cookie: string | null): GqlLanguage | null => {
  if (cookie === "en") return GqlLanguage.En;
  if (cookie === "ja") return GqlLanguage.Ja;
  return null;
};

interface UseLanguageSyncOptions {
  user: GqlUser | null | undefined;
  loading: boolean;
}

/**
 * Hook to sync browser language preference to server on first visit.
 * Only runs once per user per browser (tracked via localStorage).
 * Only active when languageSwitcher feature is enabled.
 *
 * Note: This hook accepts user and loading as parameters instead of using useAuth()
 * because it's called inside AuthProvider before the context is available.
 */
export const useLanguageSync = ({ user, loading }: UseLanguageSyncOptions) => {
  const isLanguageSwitcherEnabled = useFeatureCheck("languageSwitcher");
  const [updateMyProfile] = useMutation(UPDATE_MY_PROFILE);
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    // Guard: only run on client
    if (typeof window === "undefined") return;

    // Guard: feature must be enabled
    if (!isLanguageSwitcherEnabled) return;

    // Guard: wait for user to be loaded
    if (loading || !user) return;

    // Guard: prevent multiple sync attempts in same session
    if (hasSyncedRef.current) return;

    const storageKey = `languageSynced:${user.id}`;

    // Guard: already synced on this browser
    if (localStorage.getItem(storageKey)) return;

    const cookieLanguage = getLanguageCookie();
    const mappedLanguage = mapCookieToEnum(cookieLanguage);

    // Guard: no valid language cookie
    if (!mappedLanguage) return;

    // If cookie and DB are the same, mark as synced and skip
    if (user.preferredLanguage === mappedLanguage) {
      localStorage.setItem(storageKey, "1");
      return;
    }

    // Perform sync
    hasSyncedRef.current = true;

    updateMyProfile({
      variables: {
        input: {
          name: user.name,
          slug: user.name,
          preferredLanguage: mappedLanguage,
        },
        permission: { userId: user.id },
      },
    })
      .then(() => {
        localStorage.setItem(storageKey, "1");
        logger.debug("[useLanguageSync] Language synced to server", {
          userId: user.id,
          language: mappedLanguage,
        });
      })
      .catch((error) => {
        // Allow retry on next visit
        hasSyncedRef.current = false;
        logger.error("[useLanguageSync] Failed to sync language", {
          error: error instanceof Error ? error.message : String(error),
        });
      });
  }, [isLanguageSwitcherEnabled, loading, user, updateMyProfile]);
};
