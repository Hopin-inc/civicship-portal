// src/hooks/use-analytics-view.ts
"use client";

import { analytics } from "@/lib/firebase";
import { logEvent, setUserId, setUserProperties } from "firebase/analytics";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";

let currentUserAttributes: Record<string, string> = {};

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

    setSafeUserAttributes({
      user_id: user?.id ?? "guest",
      firebase_uid: uid ?? "",
      name: user?.name ?? "",
      phone_verified: isPhoneVerified ? "true" : "false",
      ...getDefaultClientAttributes(),
    });
  }, [user, uid, isPhoneVerified, isAuthenticating]);
};

// ---------------- ページビューの自動送信 ----------------

const useAutoPageView = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { normalizedPath, entityId, queryParams } = useMemo(() => {
    return normalizeUrlForLogging(pathname, searchParams);
  }, [pathname, searchParams]);

  const paramsJson = useMemo(
    () => JSON.stringify({ ...(entityId ? { entityId } : {}), ...queryParams }),
    [entityId, queryParams],
  );

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

  const defaultAttrs = getDefaultClientAttributes();
  const merged = { ...cleanedProps, ...defaultAttrs };
  currentUserAttributes = merged;

  if (!analytics) {
    console.warn("[Analytics] not initialized: skip setUserProperties");
    return;
  }

  setUserProperties(analytics, merged);
};

const getDefaultClientAttributes = (): Record<string, string> => {
  if (typeof window === "undefined" || typeof navigator === "undefined") return {};

  return {
    screen_width: String(window.innerWidth),
    screen_height: String(window.innerHeight),
    device_pixel_ratio: String(window.devicePixelRatio),
    language: navigator.language || "",
    user_agent: navigator.userAgent || "",
  };
};

type LogPageViewOptions = {
  path?: string;
  title?: string;
  [param: string]: string | undefined;
};

const logPageView = (options: LogPageViewOptions = {}) => {
  const { path, title, ...restParams } = options;

  const enrichedParams = {
    ...currentUserAttributes,
    page_location: path || window.location.href,
    page_title: title || document.title,
    ...restParams,
  };

  if (!analytics) {
    console.warn("[Analytics] not initialized: skip page_view");
    return;
  }

  logEvent(analytics, "page_view", enrichedParams);
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
