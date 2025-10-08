import { AuthenticationState } from "@/types/auth";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { logger } from "@/lib/logging";

export class AuthStateManager {
  private static instance: AuthStateManager;
  private stateChangeListeners: ((state: AuthenticationState) => void)[] = [];
  private readonly sessionId: string;
  private isUpdating = false;
  private pendingState: AuthenticationState | null = null;
  private readonly ALLOWED_TRANSITIONS: Record<AuthenticationState, AuthenticationState[]> = {
    unauthenticated: [
      "authenticating",
      "line_authenticated",
      "phone_authenticated",
      "user_registered",
    ],
    line_authenticated: ["line_authenticated", "phone_authenticated", "user_registered"],
    phone_authenticated: ["phone_authenticated", "user_registered"],
    user_registered: ["user_registered"],
    loading: ["unauthenticated", "line_authenticated", "phone_authenticated", "user_registered"],
    authenticating: [
      "unauthenticated",
      "line_authenticated",
      "phone_authenticated",
      "user_registered",
    ],
  };

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

  public updateState(newState: AuthenticationState, reason?: string): void {
    if (this.isUpdating) {
      console.warn("[AuthStateManager] ⚠️ Skipped update — already updating", { newState });
      return;
    }
    this.isUpdating = true;

    try {
      const { state, setState } = useAuthStore.getState();
      const current = state.authenticationState;
      const allowed = this.ALLOWED_TRANSITIONS[current] ?? [];

      const entry = {
        ts: new Date().toISOString(),
        current,
        newState,
        reason: reason ?? "(no reason)",
        allowed,
        isAllowed: allowed.includes(newState),
        downgradeBlocked: current !== "unauthenticated" && newState === "unauthenticated",
      };
      console.info("[AuthStateManager] 🔄 updateState called", entry);

      // ✅ ローカルストレージにも保存
      try {
        const key = "auth-state-transitions";
        const existing = JSON.parse(localStorage.getItem(key) || "[]");
        existing.push(entry);
        localStorage.setItem(key, JSON.stringify(existing.slice(-200))); // 最新200件だけ保持
      } catch (e) {
        console.warn("[AuthStateManager] failed to write to localStorage", e);
      }

      if (newState === current || this.pendingState === newState) {
        console.info("[AuthStateManager] ⏸ No state change (same or pending)", {
          current,
          newState,
        });
        return;
      }

      const downgradeBlocked =
        !["unauthenticated", "loading"].includes(current) && newState === "unauthenticated";
      if (downgradeBlocked) {
        console.warn("[AuthStateManager] 🚫 Downgrade blocked", { current, newState });
        return;
      }

      if (!allowed.includes(newState)) {
        console.warn("[AuthStateManager] 🚫 Transition not allowed", { current, newState });
        return;
      }

      this.pendingState = newState;
      setState({ authenticationState: newState });
      console.info("[AuthStateManager] ✅ State updated", { from: current, to: newState });

      this.stateChangeListeners.forEach((listener) => listener(newState));
    } catch (err) {
      console.error("[AuthStateManager] 💥 updateState failed", err);
    } finally {
      this.isUpdating = false;
      this.pendingState = null;
    }
  }

  public addStateChangeListener(listener: (state: AuthenticationState) => void): void {
    this.stateChangeListeners.push(listener);
  }

  public removeStateChangeListener(listener: (state: AuthenticationState) => void): void {
    this.stateChangeListeners = this.stateChangeListeners.filter((l) => l !== listener);
  }

  public async handleLineAuthStateChange(isAuthenticated: boolean): Promise<void> {
    const { state } = useAuthStore.getState();

    if (isAuthenticated) {
      if (
        state.authenticationState === "unauthenticated" ||
        state.authenticationState === "loading"
      ) {
        this.updateState("line_authenticated", "handleLineAuthStateChange");
      }
    } else {
      this.updateState("unauthenticated", "handleLineAuthStateChange");
    }
  }

  public async handlePhoneAuthStateChange(isVerified: boolean): Promise<void> {
    const { state, phoneAuth, setState } = useAuthStore.getState();
    const { phoneTokens } = phoneAuth;
    const hasValidPhoneToken =
      !!phoneTokens.accessToken &&
      phoneTokens.expiresAt &&
      Number(phoneTokens.expiresAt) - Date.now() > 5 * 60 * 1000;

    if (!hasValidPhoneToken && state.authenticationState !== "loading") {
      this.updateState("unauthenticated", "handlePhoneAuthStateChange");
      return;
    }

    if (isVerified) {
      if (state.authenticationState === "line_authenticated") {
        this.updateState("phone_authenticated", "handlePhoneAuthStateChange");
      }
    } else {
      if (
        state.authenticationState !== "unauthenticated" &&
        state.authenticationState !== "loading"
      ) {
        this.updateState("line_authenticated", "handlePhoneAuthStateChange");
      }
    }
  }

  public async handleUserRegistrationStateChange(
    isRegistered: boolean,
    options?: { ssrMode?: boolean },
  ): Promise<void> {
    const { state } = useAuthStore.getState();

    if (options?.ssrMode) {
      const newState = isRegistered ? "user_registered" : "line_authenticated";
      this.updateState(newState, "handleUserRegistrationStateChange");
      logger.debug("handleUserRegistrationStateChange: SSR Mode");
      return;
    }

    if (state.isAuthenticating) return;

    const { lineTokens } = state;
    const hasValidLineToken =
      !!lineTokens.accessToken &&
      !!lineTokens.expiresAt &&
      Number(lineTokens.expiresAt) - Date.now() > 5 * 60 * 1000;

    if (!hasValidLineToken) {
      return;
    }

    if (isRegistered) {
      if (state.authenticationState !== "user_registered") {
        this.updateState("user_registered", "handleUserRegistrationStateChange");
      }
      logger.debug("handleUserRegistrationStateChange: user_registered");
      return;
    }

    const { phoneAuth } = useAuthStore.getState();
    const hasValidPhoneToken =
      !!phoneAuth.phoneTokens.accessToken &&
      !!phoneAuth.phoneTokens.expiresAt &&
      Number(phoneAuth.phoneTokens.expiresAt) - Date.now() > 5 * 60 * 1000;

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
