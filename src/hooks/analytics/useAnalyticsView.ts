"use client";

import { analytics } from "@/lib/auth/firebase-config";
import { logEvent, setUserId, setUserProperties } from "firebase/analytics";
import { useAuth } from "@/contexts/AuthProvider";
import { useEffect, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { logger } from "@/lib/logging";

export const useAnalyticsView = () => {
  useAnalyticsUserBinding();
  useAutoPageView();
};

// ---------------- ユーザー属性のバインディング ----------------

const useAnalyticsUserBinding = () => {
  const { user, uid, isPhoneVerified, isAuthenticating } = useAuth();

  useEffect(() => {
    if (isAuthenticating || !analytics) return;

    if (user?.id) {
      setUserId(analytics, user.id);
    }
    const userProps = {
      user_id: user?.id ?? "guest",
      user_name: user?.name ?? "未設定",
      phone_verified: isPhoneVerified ? "true" : "false",
    };

    setUserProperties(analytics, userProps);
  }, [user, uid, isPhoneVerified, isAuthenticating]);
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
    logPageView({
      path: normalizedPath,
      title: document.title,
      ...parsedParams,
    });
  }, [normalizedPath, parsedParams]);
};

// ---------------- 共通ユーティリティ群 ----------------

const setSafeUserAttributes = (rawProps: Record<string, any>) => {
  const cleanedProps: Record<string, string> = {};
  for (const [key, value] of Object.entries(rawProps)) {
    if (value !== undefined && value !== null) {
      cleanedProps[key] = String(value);
    }
  }

  if (!analytics) {
    logger.warn("Analytics not initialized: skip setUserProperties", {
      component: "useAnalyticsView"
    });
    return;
  }

  setUserProperties(analytics, cleanedProps);
};

type LogPageViewOptions = {
  path?: string;
  title?: string;
  [param: string]: string | undefined;
};

const logPageView = (options: LogPageViewOptions = {}) => {
  const { path, title, ...restParams } = options;

  if (!analytics) {
    logger.warn("Analytics not initialized: skip page_view", {
      component: "useAnalyticsView"
    });
    return;
  }

  const eventParams = {
    page_location: window.location.href,
    page_title: title || document.title,
    normalized_path: path,
    ...restParams,
  };

  logger.debug("Analytics logEvent - page_view", {
    eventParams,
    component: "useAnalyticsView"
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
