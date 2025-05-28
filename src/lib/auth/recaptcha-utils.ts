"use client";

import logger from "../logging";
import { 
  createAuthLogContext, 
  startOperation, 
  endOperation, 
  generateRequestId 
} from "./logging-utils";

/**
 * reCAPTCHA用のWindow型拡張
 */
declare global {
  interface Window {
    grecaptcha: {
      render: (container: string | HTMLElement, parameters: any) => number;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      reset: (widgetId?: number) => void;
    };
  }
}

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
 * reCAPTCHA チャレンジを実行する
 * @param siteKey reCAPTCHA サイトキー
 * @param action アクション名
 * @param sessionId 認証セッションID（ログ追跡用）
 * @returns reCAPTCHA トークン
 */
export const executeRecaptchaChallenge = async (
  siteKey: string,
  action: string,
  sessionId?: string
): Promise<string | null> => {
  const op = startOperation("RecaptchaChallenge");
  const requestId = generateRequestId();
  
  logger.info("ChallengeStart", createAuthLogContext(
    sessionId || 'unknown_session',
    "general",
    op.getContext({
      event: "ChallengeStart",
      component: "reCAPTCHA",
      requestId,
      action,
      version: "v3"
    })
  ));
  
  try {
    if (typeof window === 'undefined' || !window.grecaptcha || !window.grecaptcha.execute) {
      logger.warn("RenderError", createAuthLogContext(
        sessionId || 'unknown_session',
        "general",
        op.getContext({
          event: "RenderError",
          component: "reCAPTCHA",
          requestId,
          errorCode: "grecaptcha_not_loaded",
          error: "reCAPTCHA script not loaded or initialized"
        })
      ));
      return null;
    }
    
    const token = await window.grecaptcha.execute(siteKey, { action });
    
    logger.info("ChallengeSuccess", createAuthLogContext(
      sessionId || 'unknown_session',
      "general",
      op.getContext({
        event: "ChallengeSuccess",
        component: "reCAPTCHA",
        requestId,
        tokenLength: token?.length || 0
      })
    ));
    
    return token;
  } catch (error) {
    const categorizedError = categorizeRecaptchaError(error);
    
    logger.error("ChallengeError", createAuthLogContext(
      sessionId || 'unknown_session',
      "general",
      op.getContext({
        event: "ChallengeError",
        component: "reCAPTCHA",
        requestId,
        errorCode: categorizedError.code,
        error: categorizedError.message,
        stack: error instanceof Error ? error.stack : undefined
      })
    ));
    
    return null;
  } finally {
    logger.debug("Operation completed", createAuthLogContext(
      sessionId || 'unknown_session',
      "general",
      endOperation(op.startTime, op.operationId, {
        component: "reCAPTCHA",
        operation: "challenge"
      })
    ));
  }
};

/**
 * reCAPTCHA ウィジェットをレンダリングする
 * @param containerId コンテナ要素のID
 * @param siteKey reCAPTCHA サイトキー
 * @param callback コールバック関数
 * @param sessionId 認証セッションID（ログ追跡用）
 * @returns ウィジェットID
 */
export const renderRecaptchaWidget = (
  containerId: string,
  siteKey: string,
  callback: (token: string) => void,
  sessionId?: string
): number | null => {
  const op = startOperation("RecaptchaRender");
  
  logger.info("RenderStart", createAuthLogContext(
    sessionId || 'unknown_session',
    "general",
    op.getContext({
      event: "RenderStart",
      component: "reCAPTCHA",
      containerId,
      version: "v2"
    })
  ));
  
  try {
    if (typeof window === 'undefined' || !window.grecaptcha || !window.grecaptcha.render) {
      logger.warn("RenderError", createAuthLogContext(
        sessionId || 'unknown_session',
        "general",
        op.getContext({
          event: "RenderError",
          component: "reCAPTCHA",
          errorCode: "grecaptcha_not_loaded",
          error: "reCAPTCHA script not loaded or initialized"
        })
      ));
      return null;
    }
    
    const widgetId = window.grecaptcha.render(containerId, {
      sitekey: siteKey,
      callback: (token: string) => {
        logger.info("ChallengeSuccess", createAuthLogContext(
          sessionId || 'unknown_session',
          "general",
          {
            event: "ChallengeSuccess",
            component: "reCAPTCHA",
            version: "v2",
            tokenLength: token?.length || 0,
            widgetId
          }
        ));
        
        callback(token);
      },
      'expired-callback': () => {
        logger.info("ChallengeExpired", createAuthLogContext(
          sessionId || 'unknown_session',
          "general",
          {
            event: "ChallengeExpired",
            component: "reCAPTCHA",
            version: "v2",
            widgetId
          }
        ));
      },
      'error-callback': () => {
        logger.warn("ChallengeError", createAuthLogContext(
          sessionId || 'unknown_session',
          "general",
          {
            event: "ChallengeError",
            component: "reCAPTCHA",
            version: "v2",
            errorCode: "widget_error",
            error: "reCAPTCHA widget encountered an error",
            widgetId
          }
        ));
      }
    });
    
    logger.info("RenderSuccess", createAuthLogContext(
      sessionId || 'unknown_session',
      "general",
      op.getContext({
        event: "RenderSuccess",
        component: "reCAPTCHA",
        widgetId
      })
    ));
    
    return widgetId;
  } catch (error) {
    const categorizedError = categorizeRecaptchaError(error);
    
    logger.error("RenderError", createAuthLogContext(
      sessionId || 'unknown_session',
      "general",
      op.getContext({
        event: "RenderError",
        component: "reCAPTCHA",
        errorCode: categorizedError.code,
        error: categorizedError.message,
        stack: error instanceof Error ? error.stack : undefined
      })
    ));
    
    return null;
  } finally {
    logger.debug("Operation completed", createAuthLogContext(
      sessionId || 'unknown_session',
      "general",
      endOperation(op.startTime, op.operationId, {
        component: "reCAPTCHA",
        operation: "render"
      })
    ));
  }
};

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
