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

  const isInClient = liff.isInClient();
  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const isLineUserAgent = /Line/i.test(userAgent);
  
  let result: AuthEnvironment;
  if (isInClient) {
    result = AuthEnvironment.LIFF;
  } else if (isLineUserAgent) {
    result = AuthEnvironment.LINE_BROWSER;
  } else {
    result = AuthEnvironment.REGULAR_BROWSER;
  }
  
  return result;
};

export const isRunningInLiff = (): boolean => {
  return detectEnvironment() === AuthEnvironment.LIFF;
};
