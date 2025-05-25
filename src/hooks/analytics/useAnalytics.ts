// "use client";
//
// import { analytics } from "@/lib/firebase";
// import { logEvent } from "firebase/analytics";
//
// let currentUserAttributes: Record<string, string> = {}; // `useAnalyticsView` 側で設定済みとする
//
// export const EventName = {
//   signUp: "sign_up",
//   login: "login",
//   apply: "apply",
//   accept: "accept",
//   reject: "reject",
//   cancel: "cancel",
// } as const;
//
// export type AnalyticsEventName = keyof typeof EventName;
//
// export const useAnalytics = (eventName: AnalyticsEventName) => {
//   return (eventParams: Record<string, any> = {}) => {
//     if (!analytics) {
//       console.warn(`[Analytics] not initialized: skip event '${eventName}'`);
//       return;
//     }
//
//     const enrichedParams = {
//       ...currentUserAttributes, // グローバル属性を自動付与
//       ...eventParams,
//     };
//
//     if (process.env.NODE_ENV !== "production") {
//       console.log("[Analytics] send event:", EventName[eventName], enrichedParams);
//     }
//
//     logEvent(analytics, EventName[eventName], enrichedParams);
//   };
// };
