/**
 * 認証プロセスオーケストレーター
 * 全ての認証初期化プロセスを協調させる中央制御機構
 */

import { AuthEnvironment } from "./environment-detector";
import { LiffService } from "./liff-service";
import { AuthStateManager } from "./auth-state-manager";
import { logger } from "@/lib/logging";

export type InitializationPhase = 
  | "idle"
  | "liff_init" 
  | "auth_state_init"
  | "auto_login"
  | "complete"
  | "error";

export interface OrchestrationState {
  phase: InitializationPhase;
  error: Error | null;
  startTime: number;
  phaseStartTime: number;
}

export interface OrchestrationResult {
  success: boolean;
  phase: InitializationPhase;
  error?: Error;
  duration: number;
}

/**
 * 認証初期化の段階的実行を管理するオーケストレーター
 */
export class AuthOrchestrator {
  private static instance: AuthOrchestrator | null = null;
  private state: OrchestrationState = {
    phase: "idle",
    error: null,
    startTime: 0,
    phaseStartTime: 0,
  };
  
  private subscribers: Map<string, (state: OrchestrationState) => void> = new Map();
  private initializationPromise: Promise<OrchestrationResult> | null = null;

  private constructor() {}

  public static getInstance(): AuthOrchestrator {
    if (!AuthOrchestrator.instance) {
      AuthOrchestrator.instance = new AuthOrchestrator();
    }
    return AuthOrchestrator.instance;
  }

  /**
   * 初期化状態の購読
   */
  public subscribe(id: string, callback: (state: OrchestrationState) => void): () => void {
    this.subscribers.set(id, callback);
    callback(this.state);
    
    return () => {
      this.subscribers.delete(id);
    };
  }

  /**
   * 現在の初期化状態を取得
   */
  public getState(): OrchestrationState {
    return { ...this.state };
  }

  /**
   * 認証初期化の段階的実行
   */
  public async initializeAuthentication(
    environment: AuthEnvironment,
    liffService: LiffService,
    authStateManager: AuthStateManager
  ): Promise<OrchestrationResult> {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    if (this.state.phase === "complete") {
      return {
        success: true,
        phase: "complete",
        duration: 0,
      };
    }

    this.initializationPromise = this.executeInitialization(environment, liffService, authStateManager);
    return this.initializationPromise;
  }

  private async executeInitialization(
    environment: AuthEnvironment,
    liffService: LiffService,
    authStateManager: AuthStateManager
  ): Promise<OrchestrationResult> {
    const startTime = Date.now();
    this.setState({ phase: "idle", error: null, startTime, phaseStartTime: startTime });

    try {
      logger.debug("AuthOrchestrator: Starting sequential authentication initialization", {
        component: "AuthOrchestrator",
        environment,
        timestamp: new Date().toISOString(),
      });

      await this.executeLiffInitialization(environment, liffService);

      await this.executeAuthStateInitialization(authStateManager);

      await this.executeAutoLoginAttempt(environment, liffService);

      this.setState({ 
        phase: "complete", 
        error: null, 
        startTime: this.state.startTime, 
        phaseStartTime: Date.now() 
      });

      const duration = Date.now() - startTime;
      logger.debug("AuthOrchestrator: Authentication initialization completed successfully", {
        component: "AuthOrchestrator",
        duration,
        timestamp: new Date().toISOString(),
      });

      return {
        success: true,
        phase: "complete",
        duration,
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      this.setState({ 
        phase: "error", 
        error: error as Error, 
        startTime: this.state.startTime, 
        phaseStartTime: Date.now() 
      });

      logger.error("AuthOrchestrator: Authentication initialization failed", {
        component: "AuthOrchestrator",
        error: error instanceof Error ? error.message : String(error),
        phase: this.state.phase,
        duration,
        timestamp: new Date().toISOString(),
      });

      return {
        success: false,
        phase: "error",
        error: error as Error,
        duration,
      };
    }
  }

  private async executeLiffInitialization(environment: AuthEnvironment, liffService: LiffService): Promise<void> {
    this.setState({ 
      phase: "liff_init", 
      error: null, 
      startTime: this.state.startTime, 
      phaseStartTime: Date.now() 
    });

    logger.debug("AuthOrchestrator: Starting LIFF initialization phase", {
      component: "AuthOrchestrator",
      environment,
      timestamp: new Date().toISOString(),
    });

    if (environment === AuthEnvironment.LIFF_IN_CLIENT || environment === AuthEnvironment.LIFF_WITH_SDK) {
      try {
        const ok = await liffService.ensureInitialized({ silent: true });
        if (!ok) {
          logger.warn("AuthOrchestrator: LIFF init failed; falling back to WEB auth", {
            component: "AuthOrchestrator",
            timestamp: new Date().toISOString(),
          });
        } else {
          logger.debug("AuthOrchestrator: LIFF initialization completed", {
            component: "AuthOrchestrator",
            timestamp: new Date().toISOString(),
          });
        }
      } catch (error) {
        logger.error("AuthOrchestrator: LIFF init exception", {
          component: "AuthOrchestrator",
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString(),
        });
      }
    } else {
      logger.debug("AuthOrchestrator: Skipping LIFF initialization for WEB environment", {
        component: "AuthOrchestrator",
        environment,
        timestamp: new Date().toISOString(),
      });
    }
  }

  private async executeAuthStateInitialization(authStateManager: AuthStateManager): Promise<void> {
    this.setState({ 
      phase: "auth_state_init", 
      error: null, 
      startTime: this.state.startTime, 
      phaseStartTime: Date.now() 
    });

    logger.debug("AuthOrchestrator: Starting AuthStateManager initialization phase", {
      component: "AuthOrchestrator",
      timestamp: new Date().toISOString(),
    });

    await authStateManager.initialize();
    
    logger.debug("AuthOrchestrator: AuthStateManager initialization completed", {
      component: "AuthOrchestrator",
      authState: authStateManager.getState(),
      timestamp: new Date().toISOString(),
    });
  }

  private async executeAutoLoginAttempt(environment: AuthEnvironment, liffService: LiffService): Promise<void> {
    this.setState({ 
      phase: "auto_login", 
      error: null, 
      startTime: this.state.startTime, 
      phaseStartTime: Date.now() 
    });

    logger.debug("AuthOrchestrator: Starting auto-login phase", {
      component: "AuthOrchestrator",
      environment,
      timestamp: new Date().toISOString(),
    });

    if ((environment === AuthEnvironment.LIFF_IN_CLIENT || environment === AuthEnvironment.LIFF_WITH_SDK) && liffService.available()) {
      try {
        const liffState = liffService.getState();
        if ((liffState.state === "pre-initialized" || liffState.state === "initialized") && liffState.isLoggedIn) {
          logger.debug("AuthOrchestrator: Attempting LIFF auto-login", {
            component: "AuthOrchestrator",
            liffState: liffState.state,
            isLoggedIn: liffState.isLoggedIn,
            timestamp: new Date().toISOString(),
          });

          const success = await liffService.signInWithLiffToken();
          if (success) {
            logger.debug("AuthOrchestrator: LIFF auto-login successful", {
              component: "AuthOrchestrator",
              timestamp: new Date().toISOString(),
            });
          } else {
            logger.debug("AuthOrchestrator: LIFF auto-login failed", {
              component: "AuthOrchestrator",
              timestamp: new Date().toISOString(),
            });
          }
        } else {
          logger.debug("AuthOrchestrator: Skipping auto-login - LIFF not ready or not logged in", {
            component: "AuthOrchestrator",
            liffState: liffState.state,
            isLoggedIn: liffState.isLoggedIn,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (error) {
        logger.warn("AuthOrchestrator: Auto-login attempt failed", {
          component: "AuthOrchestrator",
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString(),
        });
      }
    } else {
      logger.debug("AuthOrchestrator: Skipping auto-login for WEB environment", {
        component: "AuthOrchestrator",
        environment,
        available: liffService.available(),
        timestamp: new Date().toISOString(),
      });
    }
  }

  private setState(newState: Partial<OrchestrationState>): void {
    this.state = { ...this.state, ...newState };
    
    this.subscribers.forEach((callback) => {
      try {
        callback(this.state);
      } catch (error) {
        logger.warn("AuthOrchestrator: Subscriber callback failed", {
          component: "AuthOrchestrator",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    });
  }

  /**
   * 初期化状態をリセット（テスト用）
   */
  public reset(): void {
    this.state = {
      phase: "idle",
      error: null,
      startTime: 0,
      phaseStartTime: 0,
    };
    this.initializationPromise = null;
    this.subscribers.clear();
  }
}
