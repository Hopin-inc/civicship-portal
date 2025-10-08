import { AuthStateManager } from "../core/auth-state-manager";
import { GqlUser } from "@/types/graphql";
import { encodeURIComponentWithType, matchPaths, RawURIComponent } from "@/utils/path";
import { AccessPolicy } from "@/lib/auth/core/access-policy";

export class AuthRedirectService {
  private static instance: AuthRedirectService;
  private authStateManager: AuthStateManager;

  private constructor() {
    this.authStateManager = AuthStateManager.getInstance();
  }

  public static getInstance(): AuthRedirectService {
    if (!AuthRedirectService.instance) {
      AuthRedirectService.instance = new AuthRedirectService();
    }
    return AuthRedirectService.instance;
  }

  public isUserPath(pathname: string): boolean {
    const userPaths = ["/users/me", "/tickets", "/wallets", "/wallets/*", "/admin", "/admin/*"];
    return matchPaths(pathname, ...userPaths);
  }

  public isPathInSignUpFlow(pathname: string): boolean {
    const phoneVerificationRequiredPaths = ["/sign-up", "/sign-up/phone-verification"];
    return matchPaths(pathname, ...phoneVerificationRequiredPaths);
  }

  public getRedirectPath(
    pathname: RawURIComponent,
    next?: RawURIComponent | null,
    currentUser?: GqlUser | null,
  ): RawURIComponent | null {
    const authState = this.authStateManager.getState();
    const basePath = pathname.split("?")[0];
    const nextParam = next ? this.generateNextParam(next) : this.generateNextParam(pathname);

    const log = (step: string, extra?: Record<string, any>) => {
      const entry = {
        ts: new Date().toISOString(),
        step,
        pathname,
        basePath,
        next,
        authState,
        currentUser: !!currentUser,
        ...extra,
      };
      try {
        const existing = JSON.parse(localStorage.getItem("redirect-debug") || "[]");
        existing.push(entry);
        localStorage.setItem("redirect-debug", JSON.stringify(existing.slice(-200)));
      } catch {}
      console.log("[REDIRECT DEBUG]", entry);
    };

    log("🧭 getRedirectPath start");

    if (authState === "loading" || authState === "authenticating") {
      log("⏸ state=loading/authenticating → no redirect");
      return null;
    }

    // 1️⃣ ログイン済みユーザーがloginやsign-up画面に来た場合
    if (["/login", "/sign-up", "/sign-up/phone-verification"].includes(basePath)) {
      // 登録済みならトップへ
      if (authState === "user_registered") {
        if (next?.startsWith("/") && !next.startsWith("/login") && !next.startsWith("/sign-up")) {
          return next as RawURIComponent;
        }
        return "/" as RawURIComponent;
      }

      // LINE認証済み（電話未認証）なら電話番号ページへ
      if (authState === "line_authenticated") {
        return `/sign-up/phone-verification${nextParam}` as RawURIComponent;
      }

      // 電話認証済みなら sign-up へ
      if (authState === "phone_authenticated") {
        return `/sign-up${nextParam}` as RawURIComponent;
      }
    }

    // 2️⃣ 未認証ユーザーがユーザー専用パスに来た場合
    if (this.isUserPath(basePath)) {
      log("👤 accessing user-only path", { basePath });
      if (authState === "unauthenticated") return `/login${nextParam}` as RawURIComponent;
      if (authState === "line_token_expired")
        return `/sign-up/phone-verification${nextParam}` as RawURIComponent;
      if (authState === "phone_token_expired") return `/sign-up${nextParam}` as RawURIComponent;
    }

    // 3️⃣ サインアップフロー内の状態
    if (this.isPathInSignUpFlow(basePath)) {
      log("🌀 inside sign-up flow", { basePath });
      switch (authState) {
        case "unauthenticated":
          return `/login${nextParam}` as RawURIComponent;
        case "line_authenticated":
        case "line_token_expired": {
          const target = `/sign-up/phone-verification${nextParam}`;
          // すでにそのページにいるならリダイレクト不要
          if (pathname === target || basePath === "/sign-up/phone-verification") {
            log("✅ already on phone verification page");
            return null;
          }
          log("📞 redirect to phone verification", { from: pathname, to: target });
          return target as RawURIComponent;
        }

        case "phone_authenticated":
          if (basePath !== "/sign-up") {
            log("🪪 redirect to sign-up", { basePath });
            return `/sign-up${nextParam}` as RawURIComponent;
          }
          break;
      }
    }

    // 4️⃣ ロール不足の時はAccessPolicyで判断（任意）
    if (currentUser && !AccessPolicy.canAccess(currentUser, basePath)) {
      const fallback = AccessPolicy.getFallbackPath(currentUser);
      log("🚫 insufficient role → redirect", { fallback });
      return fallback as RawURIComponent;
    }

    log("✅ no redirect needed");
    return null;
  }

  private generateNextParam(nextPath: RawURIComponent): RawURIComponent {
    return `?next=${encodeURIComponentWithType(nextPath)}` as RawURIComponent;
  }
}
