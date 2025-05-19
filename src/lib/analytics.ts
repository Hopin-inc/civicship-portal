import { logEvent, setUserProperties } from "firebase/analytics";
import { getAnalytics, setUserId } from "@firebase/analytics";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { app } from "@/lib/firebase";

const analytics = typeof window !== "undefined" ? getAnalytics(app) : undefined;
export { analytics };

// 内部保持：ユーザー属性 + 環境情報（初期値は空）
let currentUserAttributes: Record<string, string> = {};

export function useAnalyticsUserBinding() {
  const { user, uid, isPhoneVerified, isAuthenticating } = useAuth();

  useEffect(() => {
    if (isAuthenticating || !analytics) return;

    // 認証済みユーザーには user_id を明示
    if (user?.id) {
      setUserId(analytics, user.id);
    }

    // 認証済み・未認証問わず属性は送る（GA4に紐づく）
    setSafeUserAttributes({
      user_id: user?.id ?? "guest", // または undefined を避けるなら "anonymous"
      firebase_uid: uid ?? "",
      name: user?.name ?? "",
      phone_verified: isPhoneVerified ? "true" : "false",
      ...getDefaultClientAttributes(),
    });
  }, [user, uid, isPhoneVerified, isAuthenticating]);
}

export const useAutoPageView = () => {
  const pathname = usePathname();
  const paramsObj = useParams(); // { activityId, placeId, … }

  // ❶ stringify を外に出す
  const paramsJson = JSON.stringify(paramsObj);

  useEffect(() => {
    // ❷ 必要ならパースしてオブジェクトに戻す
    const dynamicParams = JSON.parse(paramsJson);

    logPageView({
      path: pathname,
      title: document.title,
      ...dynamicParams, // activityId, placeId, ticketId, userId など
    });
    // ❸ deps はシンプルな変数参照だけにする
  }, [pathname, paramsJson]);
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

/**
 * ユーザー属性を設定し、以降のイベントに自動付加されるようにする
 */
const setSafeUserAttributes = (rawProps: Record<string, any>) => {
  const cleanedProps: Record<string, string> = {};

  for (const [key, value] of Object.entries(rawProps)) {
    if (value !== undefined && value !== null) {
      cleanedProps[key] = String(value);
    }
  }

  // デフォルトのクライアント属性をマージ
  const defaultAttrs = getDefaultClientAttributes();
  const merged = { ...cleanedProps, ...defaultAttrs };
  currentUserAttributes = merged;

  if (!analytics) {
    console.warn("[Analytics] not initialized: skip setUserProperties");
    return;
  }

  // Firebase 側のユーザープロパティにも反映（25個制限に注意）
  setUserProperties(analytics, merged);
};

/**
 * イベント送信：ユーザー属性 + params をすべて送信
 */
const safeLogEvent = (name: string, params?: Record<string, any>): void => {
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    console.log("[Analytics] → send event:", name, params);
  }
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
