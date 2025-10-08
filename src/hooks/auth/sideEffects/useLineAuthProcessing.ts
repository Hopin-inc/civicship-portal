"use client";

import { useEffect, useRef } from "react";
import { LiffService } from "@/lib/auth/service/liff-service";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { logger } from "@/lib/logging";
import { GqlUser } from "@/types/graphql";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";
import { TokenManager } from "@/lib/auth/core/token-manager";

interface UseLineAuthProcessingProps {
  shouldProcessRedirect: boolean;
  liffService: LiffService;
  refetchUser: () => Promise<GqlUser | null>;
  authStateManager: AuthStateManager | null;
}

export const useLineAuthProcessing = ({
  shouldProcessRedirect,
  liffService,
  refetchUser,
  authStateManager,
}: UseLineAuthProcessingProps) => {
  const processedRef = useRef(false);
  const setState = useAuthStore((s) => s.setState);

  // --- 共通デバッグ関数 ---
  const log = (step: string, data?: Record<string, any>) => {
    const entry = {
      ts: new Date().toISOString(),
      step,
      ...data,
    };
    console.log("[LINE AUTH PROCESSING]", entry);
    try {
      const existing = JSON.parse(localStorage.getItem("line-auth-process-debug") || "[]");
      existing.push(entry);
      localStorage.setItem("line-auth-process-debug", JSON.stringify(existing.slice(-200)));
    } catch {}
  };

  useEffect(() => {
    log("🔄 effect run", {
      shouldProcessRedirect,
      processed: processedRef.current,
    });

    if (!shouldProcessRedirect || processedRef.current) {
      log("⏸ skipped", { shouldProcessRedirect, processed: processedRef.current });
      return;
    }

    if (!authStateManager) {
      log("⚠️ authStateManager not ready → skip");
      return;
    }

    const handleLineAuthRedirect = async () => {
      processedRef.current = true;
      setState({ isAuthenticating: true });
      log("🚀 start LINE auth redirect processing");

      try {
        // --- LIFF初期化 ---
        log("⚙️ initialize LIFF start");
        const initialized = await liffService.initialize();
        log("⚙️ initialize LIFF done", { initialized });

        if (!initialized) {
          log("❌ LIFF init failed");
          logger.info("LIFF init failed", {
            authType: "liff",
            component: "useLineAuthProcessing",
          });
          return;
        }

        const { isLoggedIn } = liffService.getState();
        log("👤 liff state", { isLoggedIn });

        if (!isLoggedIn) {
          log("🚫 not logged in → stop");
          return;
        }

        // --- サインイン ---
        log("🔑 signInWithLiffToken start");
        const success = await liffService.signInWithLiffToken();
        log("🔑 signInWithLiffToken done", { success });

        if (!success) {
          log("❌ signInWithLiffToken failed");
          logger.info("signInWithLiffToken failed", {
            authType: "liff",
            component: "useLineAuthProcessing",
          });
          return;
        }

        // --- ユーザー再取得 ---
        log("🔁 refetchUser start");
        const user = await refetchUser();
        log("✅ refetchUser done", { hasUser: !!user });

        if (!user) {
          log("🚫 no user found → set line_authenticated (awaiting registration)");
          TokenManager.saveLineAuthFlag(true);
          setState({
            authenticationState: "line_authenticated",
            isAuthenticating: false,
          });
          authStateManager.updateState(
            "line_authenticated",
            "useLineAuthProcessing (no user found)",
          );
          await authStateManager.handleUserRegistrationStateChange(false);

          return;
        }

        // --- 電話認証チェック ---
        const hasPhoneIdentity = !!user.identities?.some(
          (i) => i.platform?.toUpperCase() === "PHONE",
        );
        log("📞 phone identity check", { hasPhoneIdentity });

        if (hasPhoneIdentity || TokenManager.phoneVerified()) {
          TokenManager.savePhoneAuthFlag(true);
          setState({
            currentUser: user,
            authenticationState: "user_registered",
            isAuthenticating: false,
          });
          authStateManager.updateState("user_registered", "useLineAuthProcessing (phone verified)");
          await authStateManager.handleUserRegistrationStateChange(true);
          log("✅ state=user_registered (phone identity or verified)");
        } else {
          setState({
            currentUser: user,
            authenticationState: "line_authenticated",
            isAuthenticating: false,
          });
          authStateManager.updateState("line_authenticated", "useLineAuthProcessing");
          await authStateManager.handleUserRegistrationStateChange(false);
          log("✅ state=line_authenticated (LINE only)");
        }
      } catch (err) {
        log("💥 error caught", {
          message: err instanceof Error ? err.message : String(err),
        });
        logger.info("Error during LINE auth", {
          authType: "liff",
          error: err instanceof Error ? err.message : String(err),
          component: "useLineAuthProcessing",
        });
      } finally {
        setState({ isAuthenticating: false });
        log("🏁 finalize → isAuthenticating=false");
        setTimeout(() => {
          processedRef.current = false;
          log("♻️ Reset processedRef (after finalize)");
        }, 500); // ← 適度なディレイ
      }
    };

    handleLineAuthRedirect();
  }, [shouldProcessRedirect, refetchUser, setState]);
};
