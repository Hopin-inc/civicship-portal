"use client";

import liff from "@line/liff";

export enum AuthEnvironment {
  LIFF = "liff",
  LINE_BROWSER = "line_browser",
  REGULAR_BROWSER = "regular_browser",
}

export const detectEnvironment = (): AuthEnvironment => {
  if (typeof window === "undefined") {
    return AuthEnvironment.REGULAR_BROWSER;
  }

  if (liff.isInClient()) return AuthEnvironment.LIFF;

  if (typeof navigator !== "undefined" && /Line/i.test(navigator.userAgent)) {
    return AuthEnvironment.LINE_BROWSER;
  }

  return AuthEnvironment.REGULAR_BROWSER;
};

export const isRunningInLiff = (): boolean => {
  return detectEnvironment() === AuthEnvironment.LIFF;
};
