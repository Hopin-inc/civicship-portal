"use client";

/**
 * reCAPTCHA エラー処理のためのユーティリティ関数
 */

/**
 * reCAPTCHA エラーコード
 * @see https://cloud.google.com/recaptcha/docs/reference/android/com/google/android/recaptcha/RecaptchaErrorCode
 */
export enum RecaptchaErrorCode {
  INTERNAL_ERROR = "INTERNAL_ERROR",
  INVALID_ACTION = "INVALID_ACTION",
  INVALID_KEYTYPE = "INVALID_KEYTYPE",
  INVALID_PACKAGE_NAME = "INVALID_PACKAGE_NAME",
  INVALID_SITEKEY = "INVALID_SITEKEY",
  INVALID_TIMEOUT = "INVALID_TIMEOUT",
  NETWORK_ERROR = "NETWORK_ERROR",
  NO_NETWORK_FOUND = "NO_NETWORK_FOUND",
  UNKNOWN_ERROR = "UNKNOWN_ERROR"
}

/**
 * reCAPTCHA エラーの詳細情報
 */
export interface RecaptchaErrorDetails {
  code: RecaptchaErrorCode | string;
  message: string;
  retryable: boolean;
  type: string;
}

/**
 * reCAPTCHA エラーを分類する
 * @param error エラーオブジェクト
 * @returns エラーの詳細情報
 */
export const categorizeRecaptchaError = (error: any): RecaptchaErrorDetails => {
  const defaultError: RecaptchaErrorDetails = {
    code: RecaptchaErrorCode.UNKNOWN_ERROR,
    message: error instanceof Error ? error.message : String(error),
    retryable: true,
    type: "unknown_recaptcha_error"
  };

  if (!error) return defaultError;

  let errorCode = "";
  if (typeof error === "object") {
    if ("code" in error) {
      errorCode = String(error.code);
    } else if ("errorCode" in error) {
      errorCode = String(error.errorCode);
    } else if ("message" in error && typeof error.message === "string") {
      const codeMatch = error.message.match(/code:\s*["']?([A-Z_]+)["']?/i);
      if (codeMatch && codeMatch[1]) {
        errorCode = codeMatch[1];
      }
    }
  }

  switch (errorCode) {
    case RecaptchaErrorCode.NETWORK_ERROR:
    case RecaptchaErrorCode.NO_NETWORK_FOUND:
      return {
        code: errorCode,
        message: "reCAPTCHA could not connect to Google servers. Please check your network connection.",
        retryable: true,
        type: "recaptcha_network_error"
      };
    
    case RecaptchaErrorCode.INVALID_SITEKEY:
      return {
        code: errorCode,
        message: "The site key used for reCAPTCHA is invalid.",
        retryable: false,
        type: "recaptcha_configuration_error"
      };
    
    case RecaptchaErrorCode.INTERNAL_ERROR:
      return {
        code: errorCode,
        message: "reCAPTCHA encountered an internal error. Please try again later.",
        retryable: true,
        type: "recaptcha_internal_error"
      };
    
    case RecaptchaErrorCode.INVALID_ACTION:
      return {
        code: errorCode,
        message: "The user action for reCAPTCHA is invalid.",
        retryable: false,
        type: "recaptcha_usage_error"
      };
    
    case RecaptchaErrorCode.INVALID_TIMEOUT:
      return {
        code: errorCode,
        message: "The timeout provided for reCAPTCHA is invalid.",
        retryable: true,
        type: "recaptcha_configuration_error"
      };
    
    default:
      return {
        code: errorCode || RecaptchaErrorCode.UNKNOWN_ERROR,
        message: error instanceof Error ? error.message : String(error),
        retryable: true,
        type: "recaptcha_error"
      };
  }
};
