import { TokenManager } from "./token-manager";
import { apolloClient } from "@/lib/apollo";
import { GET_CURRENT_USER } from "@/graphql/account/identity/query";

import { logger } from "@/lib/logging";
import { AuthenticationState } from "@/types/auth";
import { lineAuth } from "@/lib/auth/firebase-config";

export class AuthStateManager {
  private static instance: AuthStateManager;
  private currentState: AuthenticationState = "loading";
  private stateChangeListeners: ((state: AuthenticationState) => void)[] = [];
  private readonly sessionId: string;

  private constructor() {
    this.sessionId = this.initializeSessionId();
    if (typeof window !== "undefined") {
      window.addEventListener("auth:renew-line-token", this.handleLineTokenRenewal.bind(this));
      window.addEventListener("auth:renew-phone-token", this.handlePhoneTokenRenewal.bind(this));
    }
  }

  public static getInstance(): AuthStateManager {
    if (!AuthStateManager.instance) {
      AuthStateManager.instance = new AuthStateManager();
    }
    return AuthStateManager.instance;
  }

  public getState(): AuthenticationState {
    return this.currentState;
  }

  private initializeSessionId(): string {
    if (typeof window === "undefined") {
      return this.generateSessionId();
    }

    const SESSION_ID_KEY = "civicship_auth_session_id";

    try {
      let sessionId = localStorage.getItem(SESSION_ID_KEY);

      if (!sessionId) {
        sessionId = this.generateSessionId();
        localStorage.setItem(SESSION_ID_KEY, sessionId);
      }

      return sessionId;
    } catch (error) {
      return this.generateSessionId();
    }
  }

  private generateSessionId(): string {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return `auth_${Date.now()}_${crypto.randomUUID().replace(/-/g, "").substring(0, 9)}`;
    } else if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      return `auth_${Date.now()}_${array[0].toString(36)}`;
    } else {
      return `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  public addStateChangeListener(listener: (state: AuthenticationState) => void): void {
    this.stateChangeListeners.push(listener);
  }

  public removeStateChangeListener(listener: (state: AuthenticationState) => void): void {
    this.stateChangeListeners = this.stateChangeListeners.filter((l) => l !== listener);
  }

  public setState(state: AuthenticationState): void {
    if (this.currentState !== state) {
      this.currentState = state;
      this.notifyStateChange();
    }
  }

  private notifyStateChange(): void {
    this.stateChangeListeners.forEach((listener) => {
      listener(this.currentState);
    });
  }

  public async initialize(): Promise<void> {
    try {
      this.setState("loading");

      const lineTokens = TokenManager.getLineTokens();
      const hasValidLineToken =
        lineTokens.accessToken && !TokenManager.isTokenExpiredSync(lineTokens);

      if (!hasValidLineToken) {
        this.setState("unauthenticated");
        return;
      }

      const isUserRegistered = await this.checkUserRegistration();

      if (isUserRegistered) {
        this.setState("user_registered");
      } else {
        const phoneTokens = TokenManager.getPhoneTokens();
        const hasValidPhoneToken =
          phoneTokens.accessToken && !TokenManager.isTokenExpiredSync(lineTokens);

        if (hasValidPhoneToken) {
          this.setState("phone_authenticated");
        } else {
          this.setState("line_authenticated");
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error("Auth initialization failed", {
        error: errorMessage,
        component: "AuthStateManager",
      });
      throw error;
    }
  }

  private async checkUserRegistration(): Promise<boolean> {
    try {
      if (!lineAuth?.currentUser) {
        return false;
      }

      let accessToken = null;
      try {
        accessToken = await lineAuth.currentUser.getIdToken();
      } catch (tokenError) {
        logger.info("Failed to get Firebase token for user registration check", {
          error: tokenError instanceof Error ? tokenError.message : String(tokenError),
          component: "AuthStateManager",
        });
        return false;
      }

      const { data } = await apolloClient.query({
        query: GET_CURRENT_USER,
        fetchPolicy: "cache-first",
        context: {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        },
      });

      return data?.currentUser?.user != null;
    } catch (error) {
      logger.info("Failed to check user registration", {
        error: error instanceof Error ? error.message : String(error),
        component: "AuthStateManager",
      });
      return false;
    }
  }

  private async handleLineTokenRenewal(event: Event): Promise<void> {
    try {
      const renewed = await TokenManager.renewLineToken();

      if (renewed && this.currentState === "line_token_expired") {
        const isUserRegistered = await this.checkUserRegistration();
        if (isUserRegistered) {
          this.setState("user_registered");
        } else {
          this.setState("line_authenticated");
        }
      } else if (!renewed) {
        this.setState("unauthenticated");
      }
    } catch (error) {
      logger.info("Failed to renew LINE token", {
        error: error instanceof Error ? error.message : String(error),
        component: "AuthStateManager",
      });
      this.setState("unauthenticated");
    }
  }

  private async handlePhoneTokenRenewal(event: Event): Promise<void> {
    try {
      const renewed = await TokenManager.renewPhoneToken();
      const lineTokens = TokenManager.getLineTokens();
      const hasValidLineToken =
        lineTokens.accessToken && !(await TokenManager.isLineTokenExpired());

      if (renewed && this.currentState === "phone_token_expired") {
        this.setState("phone_authenticated");
      } else if (!renewed) {
        if (!hasValidLineToken) {
          this.setState("unauthenticated");
        } else {
          this.setState("line_authenticated");
        }
      }
    } catch (error) {
      logger.info("Failed to renew phone token", {
        authType: "phone",
        error: error instanceof Error ? error.message : String(error),
        component: "AuthStateManager",
      });

      const lineTokens = TokenManager.getLineTokens();
      const hasValidLineToken =
        lineTokens.accessToken && !(await TokenManager.isLineTokenExpired());

      if (!hasValidLineToken) {
        this.setState("unauthenticated");
      } else {
        this.setState("line_authenticated");
      }
    }
  }

  public async handleLineAuthStateChange(isAuthenticated: boolean): Promise<void> {
    if (isAuthenticated) {
      if (this.currentState === "unauthenticated" || this.currentState === "loading") {
        this.setState("line_authenticated");
      }
    } else {
      this.setState("unauthenticated");
    }
  }

  public async handlePhoneAuthStateChange(isVerified: boolean): Promise<void> {
    const lineTokens = TokenManager.getLineTokens();
    const hasValidLineToken =
      !!lineTokens.accessToken && !(await TokenManager.isLineTokenExpired());

    if (!hasValidLineToken && this.currentState !== "loading") {
      this.setState("unauthenticated");
      return;
    }

    if (isVerified) {
      if (
        this.currentState === "line_authenticated" ||
        this.currentState === "line_token_expired"
      ) {
        this.setState("phone_authenticated");
      }
    } else {
      if (this.currentState !== "unauthenticated" && this.currentState !== "loading") {
        this.setState("line_authenticated");
      }
    }
  }

  public async handleUserRegistrationStateChange(isRegistered: boolean): Promise<void> {
    const lineTokens = TokenManager.getLineTokens();
    const hasValidLineToken = lineTokens.accessToken && !(await TokenManager.isLineTokenExpired());

    if (!hasValidLineToken) {
      this.setState("unauthenticated");
      return;
    }

    if (isRegistered) {
      this.setState("user_registered");
    } else {
      const phoneTokens = TokenManager.getPhoneTokens();
      const hasValidPhoneToken =
        phoneTokens.accessToken && !(await TokenManager.isPhoneTokenExpired());

      if (hasValidPhoneToken) {
        this.setState("phone_authenticated");
      } else {
        this.setState("line_authenticated");
      }
    }
  }
}
