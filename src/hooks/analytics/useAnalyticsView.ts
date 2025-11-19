"use client";

import { logEvent, setUserId, setUserProperties } from "firebase/analytics";
import { useAuthCompat as useAuth } from "@/hooks/auth/useAuthCompat";
import { useEffect, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { logger } from "@/lib/logging";
import { getFirebaseAnalytics } from "@/lib/auth/core/firebase-config";

export const useAnalyticsView = () => {
  useAnalyticsUserBinding();
  useAutoPageView();
};

// ---------------- ユーザー属性のバインディング ----------------

const useAnalyticsUserBinding = () => {
  const { user, isPhoneVerified, isAuthenticating } = useAuth();

  useEffect(() => {
    if (isAuthenticating) return;

    getFirebaseAnalytics().then((analytics) => {
      if (user?.id && analytics) {
        setUserId(analytics, user.id);
        setUserProperties(analytics, {
          user_id: user.id,
          phone_verified: isPhoneVerified ? "true" : "false",
        });
      }
    });
  }, [user, isAuthenticating, isPhoneVerified]);
};

// ---------------- ページビューの自動送信 ----------------

const useAutoPageView = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { normalizedPath, entityId, queryParams } = useMemo(() => {
    return normalizeUrlForLogging(pathname, searchParams);
  }, [pathname, searchParams]);

  const parsedParams = useMemo(
    () => ({ ...(entityId ? { entityId } : {}), ...queryParams }),
    [entityId, queryParams],
  );

  useEffect(() => {
    void logPageView({
      path: normalizedPath,
      title: document.title,
      ...parsedParams,
    });
  }, [normalizedPath, parsedParams]);
};

// ---------------- 共通ユーティリティ群 ----------------

type LogPageViewOptions = {
  path?: string;
  title?: string;
  [param: string]: string | undefined;
};

const logPageView = async (options: LogPageViewOptions = {}) => {
  const analytics = await getFirebaseAnalytics();
  if (!analytics) {
    logger.warn("Analytics not initialized: skip page_view", {
      component: "useAnalyticsView",
    });
    return;
  }

  const { path, title, ...restParams } = options;

  const eventParams = {
    page_location: window.location.href,
    page_title: title || document.title,
    normalized_path: path,
    ...restParams,
  };

  logger.debug("Analytics logEvent - page_view", {
    eventParams,
    component: "useAnalyticsView",
  });

  logEvent(analytics, "page_view", eventParams);
};

const cuidRegex = /^c[a-z0-9]{20,}$/;

const normalizeUrlForLogging = (
  pathname: string,
  searchParams: URLSearchParams,
): {
  normalizedPath: string;
  entityId?: string;
  queryParams: Record<string, string>;
} => {
  const segments = pathname.split("/").filter(Boolean);
  const normalizedSegments = segments.map((seg) => (cuidRegex.test(seg) ? "[id]" : seg));
  const normalizedPath = "/" + normalizedSegments.join("/");
  const lastSegment = segments.at(-1);
  const entityId = lastSegment && cuidRegex.test(lastSegment) ? lastSegment : undefined;

  const queryParams: Record<string, string> = {};
  for (const [key, value] of searchParams.entries()) {
    if (value) queryParams[key] = value;
  }

  return { normalizedPath, entityId, queryParams };
};
