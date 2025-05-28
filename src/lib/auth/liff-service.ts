"use client";

import liff from "@line/liff";
import { signInWithCustomToken, updateProfile } from "firebase/auth";
import { lineAuth, categorizeFirebaseError } from "./firebase-config";
import { TokenManager, AuthTokens } from "./token-manager";
import retry from "retry";
import logger from "../logging";
import { 
  createAuthLogContext, 
  createRetryLogContext, 
  maskUserId, 
  startOperation, 
  endOperation, 
  generateRequestId 
} from "./logging-utils";

/**
 * LIFF初期化状態の型定義
 */
export type LiffState = {
  isInitialized: boolean;
  isLoggedIn: boolean;
  profile: {
    userId: string | null;
    displayName: string | null;
    pictureUrl: string | null;
  };
  error: Error | null;
};

/**
 * LIFF認証サービス
 */
export class LiffService {
  private static instance: LiffService;
  private liffId: string;
  private state: LiffState;

  /**
   * コンストラクタ
   * @param liffId LIFF ID
   */
  private constructor(liffId: string) {
    this.liffId = liffId;
    this.state = {
      isInitialized: false,
      isLoggedIn: false,
      profile: {
        userId: null,
        displayName: null,
        pictureUrl: null,
      },
      error: null,
    };
  }

  /**
   * シングルトンインスタンスを取得
   * @param liffId LIFF ID（初回のみ必要）
   * @returns LiffServiceのインスタンス
   */
  public static getInstance(liffId?: string): LiffService {
    if (!LiffService.instance) {
      if (!liffId) {
        throw new Error("LIFF ID is required for the first initialization");
      }
      LiffService.instance = new LiffService(liffId);
    }
    return LiffService.instance;
  }

  /**
   * LIFF SDKを初期化
   * @param sessionId 認証セッションID（ログ追跡用）
   * @returns 初期化が成功したかどうか
   */
  public async initialize(sessionId?: string): Promise<boolean> {
    const op = startOperation("LiffInitialize");
    
    logger.info("InitStart", createAuthLogContext(
      sessionId || 'unknown_session',
      "liff",
      op.getContext({
        event: "InitStart",
        component: "LIFF",
        liffId: this.liffId
      })
    ));
    
    try {
      if (this.state.isInitialized) {
        logger.info("InitSkipped", createAuthLogContext(
          sessionId || 'unknown_session',
          "liff",
          op.getContext({
            event: "InitSkipped",
            component: "LIFF",
            reason: "Already initialized"
          })
        ));
        return true;
      }

      await liff.init({ liffId: this.liffId });
      this.state.isInitialized = true;
      this.state.isLoggedIn = liff.isLoggedIn();

      if (this.state.isLoggedIn) {
        await this.updateProfile();
      }

      logger.info("InitSuccess", createAuthLogContext(
        sessionId || 'unknown_session',
        "liff",
        op.getContext({
          event: "InitSuccess",
          component: "LIFF",
          isLoggedIn: this.state.isLoggedIn,
          userId: this.state.profile?.userId ? maskUserId(this.state.profile.userId) : "none"
        })
      ));

      return true;
    } catch (error) {
      logger.error("InitError", createAuthLogContext(
        sessionId || 'unknown_session',
        "liff",
        op.getContext({
          event: "InitError",
          component: "LIFF",
          error: error instanceof Error ? error.message : String(error),
          errorCode: error instanceof Error && 'code' in error ? (error as any).code : 'unknown',
          stack: error instanceof Error ? error.stack : undefined,
          liffId: this.liffId
        })
      ));
      this.state.error = error as Error;
      return false;
    } finally {
      logger.debug("Operation completed", createAuthLogContext(
        sessionId || 'unknown_session',
        "liff",
        endOperation(op.startTime, op.operationId, {
          component: "LIFF",
          operation: "initialize"
        })
      ));
    }
  }

  /**
   * LIFFでログイン
   * @returns ログインが成功したかどうか
   */
  /**
   * LIFFでログイン
   * @param redirectPath リダイレクト先のパス（オプション）
   * @param sessionId 認証セッションID（ログ追跡用）
   * @returns ログインが成功したかどうか
   */
  public async login(redirectPath?: string, sessionId?: string): Promise<boolean> {
    const op = startOperation("LiffLogin");
    
    logger.info("GetLineTokenStart", createAuthLogContext(
      sessionId || 'unknown_session',
      "liff",
      op.getContext({
        event: "GetLineTokenStart",
        component: "LIFF",
        isInitialized: this.state.isInitialized,
        isLoggedIn: this.state.isLoggedIn,
        redirectPath: redirectPath || "none"
      })
    ));
    
    try {
      if (!this.state.isInitialized) {
        logger.debug("Initializing LIFF before login", createAuthLogContext(
          sessionId || 'unknown_session',
          "liff",
          op.getContext({
            component: "LIFF",
            operation: "login_initialize"
          })
        ));
        await this.initialize(sessionId);
      }

      if (!this.state.isLoggedIn) {
        if (liff.isInClient()) {
          logger.debug("In LINE client, setting logged in state", createAuthLogContext(
            sessionId || 'unknown_session',
            "liff",
            op.getContext({
              component: "LIFF",
              operation: "login_in_client"
            })
          ));
          this.state.isLoggedIn = true;
        } else {
          const redirectUri = redirectPath && typeof window !== "undefined"
            ? window.location.origin + redirectPath
            : typeof window !== "undefined" ? window.location.pathname : undefined;

          logger.info("Redirecting to LINE login", createAuthLogContext(
            sessionId || 'unknown_session',
            "liff",
            op.getContext({
              event: "GetLineTokenRedirect",
              component: "LIFF",
              redirectUri: redirectUri || "default"
            })
          ));
          
          liff.login({ redirectUri });
          return false; // リダイレクトするのでここには到達しない
        }
      }

      await this.updateProfile();
      
      logger.info("GetLineTokenSuccess", createAuthLogContext(
        sessionId || 'unknown_session',
        "liff",
        op.getContext({
          event: "GetLineTokenSuccess",
          component: "LIFF",
          userId: this.state.profile?.userId ? maskUserId(this.state.profile.userId) : "none",
          hasDisplayName: !!this.state.profile?.displayName,
          hasPictureUrl: !!this.state.profile?.pictureUrl,
          tokenLength: this.getAccessToken()?.length || 0
        })
      ));
      
      return true;
    } catch (error) {
      logger.error("GetLineTokenError", createAuthLogContext(
        sessionId || 'unknown_session',
        "liff",
        op.getContext({
          event: "GetLineTokenError",
          component: "LIFF",
          error: error instanceof Error ? error.message : String(error),
          errorCode: error instanceof Error && 'code' in error ? (error as any).code : 'unknown',
          stack: error instanceof Error ? error.stack : undefined,
          isInitialized: this.state.isInitialized,
          redirectPath: redirectPath || "none"
        })
      ));
      this.state.error = error as Error;
      return false;
    } finally {
      logger.debug("Operation completed", createAuthLogContext(
        sessionId || 'unknown_session',
        "liff",
        endOperation(op.startTime, op.operationId, {
          component: "LIFF",
          operation: "login"
        })
      ));
    }
  }

  /**
   * LIFFからログアウト
   * @param sessionId 認証セッションID（ログ追跡用）
   */
  public logout(sessionId?: string): void {
    if (this.state.isInitialized && this.state.isLoggedIn) {
      logger.info("LIFF logout initiated", createAuthLogContext(
        sessionId || 'unknown_session',
        "liff",
        {
          operation: "logout",
          userId: this.state.profile?.userId ? maskUserId(this.state.profile.userId) : "none"
        }
      ));
      
      liff.logout();
      this.state.isLoggedIn = false;
      this.state.profile = {
        userId: null,
        displayName: null,
        pictureUrl: null,
      };
      
      logger.info("LIFF logout completed", createAuthLogContext(
        sessionId || 'unknown_session',
        "liff",
        {
          operation: "logout"
        }
      ));
    }
  }

  /**
   * LIFFプロファイル情報を更新
   * @param sessionId 認証セッションID（ログ追跡用）
   */
  private async updateProfile(sessionId?: string): Promise<void> {
    try {
      if (!this.state.isInitialized || !this.state.isLoggedIn) {
        return;
      }

      const profile = await liff.getProfile();
      this.state.profile = {
        userId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl || null,
      };
    } catch (error) {
      logger.error("Failed to get LIFF profile", createAuthLogContext(
        sessionId || 'unknown_session',
        "liff",
        {
          operation: "updateProfile",
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          isLoggedIn: this.state.isLoggedIn,
          userId: this.state.profile?.userId ? maskUserId(this.state.profile.userId) : "none"
        }
      ));
    }
  }

  /**
   * LIFFアクセストークンを取得
   * @returns LIFFアクセストークン
   */
  public getAccessToken(): string | null {
    if (!this.state.isInitialized || !this.state.isLoggedIn) {
      return null;
    }
    return liff.getAccessToken();
  }

  /**
   * LIFFトークンを使用してFirebase認証を行う
   * @param sessionId 認証セッションID（ログ追跡用）
   * @returns 認証が成功したかどうか
   */
  public async signInWithLiffToken(sessionId?: string): Promise<boolean> {
    const op = startOperation("SignInWithLiffToken");
    const requestId = generateRequestId();
    
    logger.info("CustomTokenRequestStart", createAuthLogContext(
      sessionId || 'unknown_session',
      "liff",
      op.getContext({
        event: "CustomTokenRequestStart",
        component: "FirebaseAuth",
        requestId,
        lineUserId: this.state.profile?.userId ? maskUserId(this.state.profile.userId) : "none"
      })
    ));
    
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      logger.error("CustomTokenRequestError", createAuthLogContext(
        sessionId || 'unknown_session',
        "liff",
        op.getContext({
          event: "CustomTokenRequestError",
          component: "FirebaseAuth",
          requestId,
          errorCode: "no_access_token",
          error: "No LIFF access token available",
          isInitialized: this.state.isInitialized,
          isLoggedIn: this.state.isLoggedIn
        })
      ));
      return false;
    }

    const operation = retry.operation({
      retries: 3,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 10000,
      randomize: true,
    });

    return new Promise((resolve) => {
      operation.attempt(async (currentAttempt) => {
        const attemptOp = startOperation(`SignInAttempt${currentAttempt}`);
        const attemptRequestId = generateRequestId();
        
        try {
          logger.debug("SignInWithTokenStart", createAuthLogContext(
            sessionId || 'unknown_session',
            "liff",
            attemptOp.getContext({
              event: "SignInWithTokenStart",
              component: "FirebaseAuth",
              requestId: attemptRequestId,
              parentRequestId: requestId,
              attempt: currentAttempt,
              ...createRetryLogContext(currentAttempt, 3, currentAttempt - 1),
              isInitialized: this.state.isInitialized,
              isLoggedIn: this.state.isLoggedIn,
              accessToken: this.getAccessToken() ? "present" : "missing",
              userId: this.state.profile?.userId ? maskUserId(this.state.profile.userId) : "none"
            })
          ));

          logger.debug("VerifyLineIdTokenStart", createAuthLogContext(
            sessionId || 'unknown_session',
            "liff",
            attemptOp.getContext({
              event: "VerifyLineIdTokenStart",
              component: "Backend",
              requestId: attemptRequestId,
              parentRequestId: requestId,
              tokenLength: accessToken.length
            })
          ));
          
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_LIFF_LOGIN_ENDPOINT}/line/liff-login`,
            {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                "X-Request-ID": attemptRequestId
              },
              body: JSON.stringify({ accessToken }),
            },
          );

          if (response.ok) {
            logger.debug("VerifyLineIdTokenSuccess", createAuthLogContext(
              sessionId || 'unknown_session',
              "liff",
              attemptOp.getContext({
                event: "VerifyLineIdTokenSuccess",
                component: "Backend",
                requestId: attemptRequestId,
                parentRequestId: requestId,
                status: response.status,
                statusText: response.statusText
              })
            ));
          } else {
            logger.warn("VerifyLineIdTokenError", createAuthLogContext(
              sessionId || 'unknown_session',
              "liff",
              attemptOp.getContext({
                event: "VerifyLineIdTokenError",
                component: "Backend",
                requestId: attemptRequestId,
                parentRequestId: requestId,
                status: response.status,
                statusText: response.statusText,
                attempt: currentAttempt,
                ...createRetryLogContext(currentAttempt, 3, currentAttempt - 1)
              })
            ));
            throw new Error(`LIFF authentication failed: ${response.status}`);
          }

          const { customToken, profile } = await response.json();
          
          logger.debug("CustomTokenRequestSuccess", createAuthLogContext(
            sessionId || 'unknown_session',
            "liff",
            attemptOp.getContext({
              event: "CustomTokenRequestSuccess",
              component: "FirebaseAuth",
              requestId: attemptRequestId,
              parentRequestId: requestId,
              customTokenLength: customToken?.length || 0,
              profileName: profile?.displayName || "none"
            })
          ));

          logger.debug("SignInWithTokenStart", createAuthLogContext(
            sessionId || 'unknown_session',
            "liff",
            attemptOp.getContext({
              event: "SignInWithTokenStart",
              component: "FirebaseAuth",
              requestId: attemptRequestId,
              parentRequestId: requestId
            })
          ));
          
          const userCredential = await signInWithCustomToken(lineAuth, customToken);
          
          logger.info("SignInWithTokenSuccess", createAuthLogContext(
            sessionId || 'unknown_session',
            "liff",
            attemptOp.getContext({
              event: "SignInWithTokenSuccess",
              component: "FirebaseAuth",
              requestId: attemptRequestId,
              parentRequestId: requestId,
              uid: maskUserId(userCredential.user.uid),
              isNewUser: userCredential.user.metadata.creationTime === userCredential.user.metadata.lastSignInTime
            })
          ));
          
          logger.debug("FirebaseLinkAccountStart", createAuthLogContext(
            sessionId || 'unknown_session',
            "liff",
            attemptOp.getContext({
              event: "FirebaseLinkAccountStart",
              component: "FirebaseAuth",
              requestId: attemptRequestId,
              parentRequestId: requestId,
              existingUid: maskUserId(userCredential.user.uid),
              newProvider: "LINE"
            })
          ));
          
          await updateProfile(userCredential.user, {
            displayName: profile.displayName,
            photoURL: profile.pictureUrl,
          });
          
          logger.debug("FirebaseLinkAccountSuccess", createAuthLogContext(
            sessionId || 'unknown_session',
            "liff",
            attemptOp.getContext({
              event: "FirebaseLinkAccountSuccess",
              component: "FirebaseAuth",
              requestId: attemptRequestId,
              parentRequestId: requestId,
              linkedUid: maskUserId(userCredential.user.uid)
            })
          ));

          const idToken = await userCredential.user.getIdToken();
          const refreshToken = userCredential.user.refreshToken;
          const tokenResult = await userCredential.user.getIdTokenResult();
          const expirationTime = new Date(tokenResult.expirationTime).getTime();

          const tokens: AuthTokens = {
            accessToken: idToken,
            refreshToken: refreshToken,
            expiresAt: expirationTime,
          };
          TokenManager.saveLineTokens(tokens);

          logger.info("onAuthStateChanged", createAuthLogContext(
            sessionId || 'unknown_session',
            "liff",
            op.getContext({
              event: "onAuthStateChanged",
              component: "FirebaseAuth",
              requestId,
              prevState: "unauthenticated",
              newState: "authenticated",
              userId: maskUserId(userCredential.user.uid),
              duration: Date.now() - op.startTime
            })
          ));
          
          logger.debug("Attempt completed", createAuthLogContext(
            sessionId || 'unknown_session',
            "liff",
            endOperation(attemptOp.startTime, attemptOp.operationId, {
              component: "FirebaseAuth",
              operation: "signInAttempt",
              attempt: currentAttempt,
              status: "success"
            })
          ));
          
          resolve(true);
        } catch (error) {
          const categorizedError = categorizeFirebaseError(error);

          const logLevel = categorizedError.retryable ? "info" : "error";
          logger[logLevel]("SignInWithTokenError", createAuthLogContext(
            sessionId || 'unknown_session',
            "liff",
            attemptOp.getContext({
              event: "SignInWithTokenError",
              component: "FirebaseAuth",
              requestId: attemptRequestId,
              parentRequestId: requestId,
              attempt: currentAttempt,
              ...createRetryLogContext(currentAttempt, 3, currentAttempt - 1),
              errorCode: categorizedError.type,
              error: categorizedError.message,
              retryable: categorizedError.retryable,
              stack: error instanceof Error ? error.stack : undefined
            })
          ));
          
          logger.debug("Attempt completed", createAuthLogContext(
            sessionId || 'unknown_session',
            "liff",
            endOperation(attemptOp.startTime, attemptOp.operationId, {
              component: "FirebaseAuth",
              operation: "signInAttempt",
              attempt: currentAttempt,
              status: "failed",
              error: categorizedError.message,
              errorCode: categorizedError.type
            })
          ));

          if (!categorizedError.retryable || !operation.retry(error as Error)) {
            logger.error("CustomTokenRequestError", createAuthLogContext(
              sessionId || 'unknown_session',
              "liff",
              op.getContext({
                event: "CustomTokenRequestError",
                component: "FirebaseAuth",
                requestId,
                errorCode: categorizedError.type,
                error: categorizedError.message,
                stack: error instanceof Error ? error.stack : undefined,
                attempts: currentAttempt
              })
            ));

            if (typeof window !== "undefined") {
              window.dispatchEvent(
                new CustomEvent("auth:error", {
                  detail: {
                    source: "liff",
                    errorType: categorizedError.type,
                    errorMessage: categorizedError.message,
                    originalError: error,
                  },
                }),
              );
            }

            resolve(false);
          }
        }
      });
    });
  }

  /**
   * 現在のLIFF状態を取得
   * @returns LIFF状態
   */
  public getState(): LiffState {
    return { ...this.state };
  }
}
