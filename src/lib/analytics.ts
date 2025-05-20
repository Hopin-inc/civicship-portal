import { logEvent, setUserProperties } from "firebase/analytics";
import { getAnalytics, setUserId } from "@firebase/analytics";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { app } from "@/lib/firebase";

let analyticsInstance: ReturnType<typeof getAnalytics> | undefined;

export const getSafeAnalytics = () => {
  if (typeof window === "undefined") return undefined;
  if (typeof window.gtag !== "function") {
    console.warn("[Analytics] gtag not ready");
    return undefined;
  }
  if (!analyticsInstance) {
    analyticsInstance = getAnalytics(app);
  }
  return analyticsInstance;
};

// 内部保持：ユーザー属性 + 環境情報（初期値は空）
let currentUserAttributes: Record<string, string> = {};

export function useAnalyticsUserBinding() {
  const { user, uid, isPhoneVerified, isAuthenticating } = useAuth();

  useEffect(() => {
    const analytics = getSafeAnalytics();
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
}

export const useAutoPageView = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { normalizedPath, entityId, queryParams } = useMemo(() => {
    return normalizeUrlForLogging(pathname, searchParams);
  }, [pathname, searchParams]);

  const paramsJson = useMemo(() => {
    return JSON.stringify({
      ...(entityId ? { entityId } : {}),
      ...queryParams,
    });
  }, [entityId, queryParams]);

  useEffect(() => {
    const parsedParams = JSON.parse(paramsJson);
    logPageView({
      path: normalizedPath,
      title: document.title,
      ...parsedParams,
    });
  }, [normalizedPath, paramsJson]);
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

  const analytics = getSafeAnalytics(); // ← ここで取得

  if (!analytics) {
    console.warn("[Analytics] not initialized: skip setUserProperties");
    return;
  }

  setUserProperties(analytics, merged);
};

const safeLogEvent = (name: string, params?: Record<string, any>): void => {
  const isDev = process.env.NODE_ENV !== "production";
  if (isDev) {
    console.log("[Analytics] → send event:", name, params);
  }

  const analytics = getSafeAnalytics(); // ← ここでも取得

  if (!analytics) {
    console.warn(`[Analytics] not initialized: skip event '${name}'`);
    return;
  }

  const enrichedParams = { ...currentUserAttributes, ...params };
  if (isDev) {
    console.log("[Analytics] → enriched params:", enrichedParams);
  }

  logEvent(analytics, name, enrichedParams);
};

// ------------------- 代表的イベント -------------------

type LogPageViewOptions = {
  path?: string;
  title?: string;
  [param: string]: string | undefined;
};

export const logPageView = (options: LogPageViewOptions = {}) => {
  const { path, title, ...restParams } = options;
  safeLogEvent("page_view", {
    page_location: path || window.location.href,
    page_title: title || document.title,
    ...restParams,
  });
};

type NormalizedUrlResult = {
  normalizedPath: string;
  entityId?: string;
  queryParams: Record<string, string>;
};

const cuidRegex = /^c[a-z0-9]{20,}$/;

const normalizeUrlForLogging = (
  pathname: string,
  searchParams: URLSearchParams,
): NormalizedUrlResult => {
  const segments = pathname.split("/").filter(Boolean);

  // 正規化されたパス（CUIDを [id] に変換）
  const normalizedSegments = segments.map((seg) => (cuidRegex.test(seg) ? "[id]" : seg));
  const normalizedPath = "/" + normalizedSegments.join("/");

  // entityId: 最後のセグメントが CUID なら
  const lastSegment = segments.at(-1);
  const entityId = lastSegment && cuidRegex.test(lastSegment) ? lastSegment : undefined;

  // queryParams: SearchParams からすべて取得（undefinedは除外）
  const queryParams: Record<string, string> = {};
  for (const [key, value] of searchParams.entries()) {
    if (value) queryParams[key] = value;
  }

  return { normalizedPath, entityId, queryParams };
};
