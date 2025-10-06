import { AuthenticationState } from "@/types/auth";
import { useAuthStore } from "@/hooks/auth/auth-store";
import { logger } from "@/lib/logging";

export class AuthStateManager {
  private static instance: AuthStateManager;
  private stateChangeListeners: ((state: AuthenticationState) => void)[] = [];
  private readonly sessionId: string;

  private constructor() {
    this.sessionId = this.initializeSessionId();
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
    const { state, phoneAuth, setState } = useAuthStore.getState();
    const { phoneTokens } = phoneAuth;
    const hasValidPhoneToken =
      !!phoneTokens.accessToken &&
      phoneTokens.expiresAt &&
      phoneTokens.expiresAt - Date.now() > 5 * 60 * 1000;

    if (!hasValidPhoneToken && state.authenticationState !== "loading") {
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

  public async handleUserRegistrationStateChange(
    isRegistered: boolean,
    options?: { ssrMode?: boolean },
  ): Promise<void> {
    const { state, setState } = useAuthStore.getState();

    if (options?.ssrMode) {
      setState({
        authenticationState: isRegistered ? "user_registered" : "line_authenticated",
      });
      logger.debug("handleUserRegistrationStateChange: SSR Mode");
      return;
    }

    if (state.isAuthenticating) return;

    const { lineTokens } = state;
    const hasValidLineToken =
      !!lineTokens.accessToken &&
      !!lineTokens.expiresAt &&
      lineTokens.expiresAt - Date.now() > 5 * 60 * 1000;

    if (!hasValidLineToken) {
      return;
    }

    if (isRegistered) {
      if (state.authenticationState !== "user_registered") {
        setState({ authenticationState: "user_registered" });
      }
      logger.debug("handleUserRegistrationStateChange: user_registered");
      return;
    }

    const { phoneAuth } = useAuthStore.getState();
    const hasValidPhoneToken =
      !!phoneAuth.phoneTokens.accessToken &&
      !!phoneAuth.phoneTokens.expiresAt &&
      phoneAuth.phoneTokens.expiresAt - Date.now() > 5 * 60 * 1000;

    if (hasValidPhoneToken && state.authenticationState === "line_authenticated") {
      await this.handlePhoneAuthStateChange(true);
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
