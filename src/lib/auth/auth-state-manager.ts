import { TokenManager } from "./token-manager";

import { logger } from "@/lib/logging";
import { AuthenticationState } from "@/types/auth";
import { lineAuth } from "@/lib/auth/firebase-config";
import { useAuthStore } from "@/hooks/auth/auth-store";

export class AuthStateManager {
  private static instance: AuthStateManager;
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
    return useAuthStore.getState().state.authenticationState;
  }

  public addStateChangeListener(listener: (state: AuthenticationState) => void): void {
    this.stateChangeListeners.push(listener);
  }

  public removeStateChangeListener(listener: (state: AuthenticationState) => void): void {
    this.stateChangeListeners = this.stateChangeListeners.filter((l) => l !== listener);
  }

  private checkUserRegistration(): boolean {
    try {
      if (!lineAuth?.currentUser) {
        return false;
      }
      const state = useAuthStore.getState();
      const currentUser = state.state.currentUser;

      return currentUser != null;
    } catch (error) {
      logger.info("Failed to check user registration", {
        error: error instanceof Error ? error.message : String(error),
        component: "AuthStateManager",
      });
      return false;
    }
  }

  private async handleLineTokenRenewal(event: Event): Promise<void> {
    const { state, setState } = useAuthStore.getState();

    try {
      const renewed = await TokenManager.renewLineToken();

      if (renewed && state.authenticationState === "line_token_expired") {
        // user_registered かどうかは currentUser の有無で判定
        if (state.currentUser) {
          setState({ authenticationState: "user_registered" });
        } else {
          setState({ authenticationState: "line_authenticated" });
        }
      } else if (!renewed) {
        setState({ authenticationState: "unauthenticated" });
      }
    } catch (error) {
      logger.info("Failed to renew LINE token", {
        error: error instanceof Error ? error.message : String(error),
        component: "AuthStateManager",
      });
      setState({ authenticationState: "unauthenticated" });
    }
  }

  private async handlePhoneTokenRenewal(event: Event): Promise<void> {
    const { state, setState } = useAuthStore.getState();

    try {
      const renewed = await TokenManager.renewPhoneToken();
      const lineTokens = TokenManager.getLineTokens();
      const hasValidLineToken =
        lineTokens.accessToken && !(await TokenManager.isLineTokenExpired());

      if (renewed && state.authenticationState === "phone_token_expired") {
        setState({ authenticationState: "phone_authenticated" });
      } else if (!renewed) {
        if (!hasValidLineToken) {
          setState({ authenticationState: "unauthenticated" });
        } else {
          setState({ authenticationState: "line_authenticated" });
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
        setState({ authenticationState: "unauthenticated" });
      } else {
        setState({ authenticationState: "line_authenticated" });
      }
    }
  }

  public async handleLineAuthStateChange(isAuthenticated: boolean): Promise<void> {
    const { state, setState } = useAuthStore.getState();

    if (isAuthenticated) {
      if (
        state.authenticationState === "unauthenticated" ||
        state.authenticationState === "loading"
      ) {
        setState({ authenticationState: "line_authenticated" });
      }
    } else {
      setState({ authenticationState: "unauthenticated" });
    }
  }

  public async handlePhoneAuthStateChange(isVerified: boolean): Promise<void> {
    const { state, setState } = useAuthStore.getState();
    const lineTokens = TokenManager.getLineTokens();
    const hasValidLineToken =
      !!lineTokens.accessToken && !(await TokenManager.isLineTokenExpired());

    if (!hasValidLineToken && state.authenticationState !== "loading") {
      setState({ authenticationState: "unauthenticated" });
      return;
    }

    if (isVerified) {
      if (
        state.authenticationState === "line_authenticated" ||
        state.authenticationState === "line_token_expired"
      ) {
        setState({ authenticationState: "phone_authenticated" });
      }
    } else {
      if (
        state.authenticationState !== "unauthenticated" &&
        state.authenticationState !== "loading"
      ) {
        setState({ authenticationState: "line_authenticated" });
      }
    }
  }

  public async handleUserRegistrationStateChange(isRegistered: boolean): Promise<void> {
    const { setState } = useAuthStore.getState();
    const lineTokens = TokenManager.getLineTokens();
    const hasValidLineToken = lineTokens.accessToken && !(await TokenManager.isLineTokenExpired());

    if (!hasValidLineToken) {
      setState({ authenticationState: "unauthenticated" });
      return;
    }

    if (isRegistered) {
      setState({ authenticationState: "user_registered" });
    } else {
      const phoneTokens = TokenManager.getPhoneTokens();
      const hasValidPhoneToken =
        phoneTokens.accessToken && !(await TokenManager.isPhoneTokenExpired());

      if (hasValidPhoneToken) {
        setState({ authenticationState: "phone_authenticated" });
      } else {
        setState({ authenticationState: "line_authenticated" });
      }
    }
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
}
