"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  GqlCurrentPrefecture,
  GqlUser,
  useCurrentUserQuery,
  useUserSignUpMutation,
} from "@/types/graphql";
import { User as AuthUser } from "@firebase/auth";
import { Required } from "utility-types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCookies } from "next-client-cookies";
import {
  auth,
  getVerifiedPhoneNumber,
  isPhoneVerified as checkPhoneVerified,
  phoneVerificationState,
  signInWithLiffToken,
  startPhoneNumberVerification,
  verifyPhoneCode,
} from "@/lib/firebase";
import { toast } from "sonner";
import { deferred } from "@/utils/defer";
import { useLiff } from "./LiffContext";
import { COMMUNITY_ID } from "@/utils";

type UserInfo = {
  uid: string | null;
  user:
    | (Required<Partial<GqlUser>, "id" | "name"> & {
        memberships?: any[];
      })
    | null;
};

type AuthContextType = UserInfo & {
  login: (userInfo: UserInfo | null) => void;
  logout: () => Promise<void>;
  loginWithLiff: () => Promise<void>;
  isAuthenticating: boolean;
  createUser: (
    name: string,
    currentPrefecture: GqlCurrentPrefecture,
    phoneUid?: string | null,
  ) => Promise<Required<Partial<GqlUser>, "id" | "name"> | null>;

  phoneNumber: string | null;
  phoneAuth: {
    isVerifying: boolean;
    verificationId: string | null;
    phoneUid: string | null;
    startPhoneVerification: (phoneNumber: string) => Promise<boolean>;
    verifyPhoneCode: (code: string) => Promise<boolean>;
  };
  isPhoneVerified: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cookies = useCookies();
  const { liff, isLiffLoggedIn, liffAccessToken, liffLogin, liffLogout } = useLiff();

  const {
    data: currentUserData,
    loading: gqlLoading,
    refetch,
    error: queryError,
  } = useCurrentUserQuery({
    fetchPolicy: "no-cache",
  });

  const [ready] = useState(() => deferred());
  const [uid, setUid] = useState<UserInfo["uid"]>(null);
  const [user, setUser] = useState<UserInfo["user"]>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isExplicitLogin, setIsExplicitLogin] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  // 電話番号認証
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // 初回の認証状態が終わったか
  const [authLoading, setAuthLoading] = useState(true);

  const login = useCallback((userInfo: UserInfo | null) => {
    setUid(userInfo?.uid ?? null);
    setUser(userInfo?.user ?? null);
  }, []);

  useEffect(() => {
    if (currentUserData?.currentUser?.user && uid) {
      const fetchedUser = currentUserData.currentUser.user;
      login({
        uid,
        user: {
          id: fetchedUser.id,
          name: fetchedUser.name,
          memberships: fetchedUser.memberships || ([] as any),
        },
      });
    }
  }, [currentUserData, uid, login]);

  const [userSignUpMutation] = useUserSignUpMutation();

  const startPhoneVerification = async (phoneNumber: string): Promise<boolean> => {
    setIsVerifying(true);
    try {
      const verId = await startPhoneNumberVerification(phoneNumber);
      setVerificationId(verId);
      setPhoneNumber(phoneNumber);
      return true;
    } catch (error) {
      console.error("Failed to start phone verification:", error);
      toast.error("電話番号認証の開始に失敗しました");
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const verifyPhoneCodeLocal = async (code: string): Promise<boolean> => {
    if (!verificationId) {
      toast.error("認証IDがありません。もう一度電話番号を入力してください");
      return false;
    }

    setIsVerifying(true);
    try {
      const success = await verifyPhoneCode(verificationId, code);

      if (success) {
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (phoneVerificationState.phoneUid) {
          if (phoneVerificationState.authToken) {
            cookies.set("phone_auth_token", phoneVerificationState.authToken);
          }
          if (phoneVerificationState.refreshToken) {
            cookies.set("phone_refresh_token", phoneVerificationState.refreshToken);
          }
          if (phoneVerificationState.tokenExpiresAt) {
            const timestamp = Math.floor(phoneVerificationState.tokenExpiresAt.getTime() / 1000);
            cookies.set("phone_token_expires_at", timestamp.toString());
          }

          console.log("Phone verification successful with tokens:", {
            phoneUid: phoneVerificationState.phoneUid,
            authToken: phoneVerificationState.authToken ? "present" : "missing",
            refreshToken: phoneVerificationState.refreshToken ? "present" : "missing",
            tokenExpiresAt: phoneVerificationState.tokenExpiresAt,
          });

          setIsPhoneVerified(true);
          toast.success("電話番号認証が完了しました");
          router.push("/sign-up");
          return true;
        } else {
          toast.error("電話番号認証IDが取得できませんでした");
          return false;
        }
      } else {
        toast.error("認証コードの検証に失敗しました");
        return false;
      }
    } catch (error) {
      console.error("Failed to verify phone code:", error);
      toast.error("認証コードの検証に失敗しました");
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const loginWithLiff = async (): Promise<void> => {
    if (!liff) throw new Error("LIFF is not initialized");

    setIsAuthenticating(true);
    setIsExplicitLogin(true);

    console.log("🔐 loginWithLiff started");

    try {
      await liffLogin();

      const phoneVerified = checkPhoneVerified();
      setIsPhoneVerified(phoneVerified);

      console.log("✅ LIFF login completed");
      console.log("📱 Phone verification status set");
    } catch (error) {
      console.error("❌ loginWithLiff encountered an error");
      throw error;
    } finally {
      setIsAuthenticating(false);
      setIsExplicitLogin(false);

      console.log("🔚 loginWithLiff finished");
    }
  };

  const handleAuthenticateWithLiffToken = async (accessToken: string): Promise<boolean> => {
    setIsAuthenticating(true);

    try {
      const success = await signInWithLiffToken(accessToken);
      if (!success) {
        return false;
      }
      return true;
    } catch (error) {
      console.error("Unexpected error during LIFF token authentication:", error);
      toast.error("予期せぬエラーが発生しました。もう一度お試しください。");
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  useEffect(() => {
    const attemptAuthWithLiffToken = async () => {
      if (liffAccessToken && isLiffLoggedIn && !uid) {
        await handleAuthenticateWithLiffToken(liffAccessToken);
      }
    };

    attemptAuthWithLiffToken();
  }, [liffAccessToken, isLiffLoggedIn, uid]);

  useEffect(() => {
    const handleTokenExpired = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log("Token expired event detected:", customEvent.detail);

      toast.error("認証の有効期限が切れました。再認証が必要です。", {
        action: {
          label: "再認証",
          onClick: () => router.push("/sign-up/phone-verification"),
        },
        duration: 10000, // 10 seconds
      });
    };

    const handleAuthError = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { errorType, errorMessage } = customEvent.detail;

      console.log("Auth error event detected:", customEvent.detail);

      setIsAuthenticating(false);

      toast.error(errorMessage, {
        action:
          errorType === "network"
            ? {
                label: "再試行",
                onClick: () => window.location.reload(),
              }
            : errorType === "expired" || errorType === "auth" || errorType === "reauth"
              ? {
                  label: "再認証",
                  onClick: () => router.push("/login"),
                }
              : undefined,
        duration: 10000, // 10 seconds
      });
    };

    window.addEventListener("auth:token-expired", handleTokenExpired);
    window.addEventListener("auth:error", handleAuthError);
    window.addEventListener("auth:token-refresh-failed", handleAuthError);

    return () => {
      window.removeEventListener("auth:token-expired", handleTokenExpired);
      window.removeEventListener("auth:error", handleAuthError);
      window.removeEventListener("auth:token-refresh-failed", handleAuthError);
    };
  }, [router]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: AuthUser | null) => {
      ready.resolve();

      if (user) {
        const next = searchParams.get("next");
        const idToken = await user.getIdToken();
        cookies.set("access_token", idToken);

        if (user.refreshToken) {
          cookies.set("refresh_token", user.refreshToken);
          console.log("LINE refresh token stored in cookies");
        }

        try {
          const tokenResult = await user.getIdTokenResult();
          if (tokenResult.expirationTime) {
            const expiryTimestamp = Math.floor(
              new Date(tokenResult.expirationTime).getTime() / 1000,
            );
            cookies.set("token_expires_at", expiryTimestamp.toString());
            console.log("Token expiration time stored:", expiryTimestamp);
          }
        } catch (error) {
          console.error("Failed to get token expiration time:", error);
        }

        try {
          console.log("Attempting to fetch user data...");
          const result = await refetch();

          if (!result.data.currentUser?.user) {
            throw new Error("User data not found after authentication");
          }

          const fetchedUser = result.data.currentUser?.user ?? null;
          if (fetchedUser) {
            login({
              uid: user.uid,
              user: {
                id: fetchedUser.id,
                name: fetchedUser.name,
                memberships: fetchedUser.memberships || ([] as any),
              },
            });

            if (isExplicitLogin) {
              toast.success("ログインしました！");
              setIsExplicitLogin(false);
            }

            if (next) {
              router.push(next);
            }
          } else {
            console.warn("User data fetch failed after all retries, redirecting to sign-up");
            if (isPhoneVerified || checkPhoneVerified()) {
              router.push("/sign-up");
            } else {
              router.push("/sign-up/phone-verification");
            }
          }
        } catch (error) {
          console.error("Failed to fetch user data after retries:", error);
          if (isPhoneVerified || checkPhoneVerified()) {
            router.push("/sign-up");
          } else {
            router.push("/sign-up/phone-verification");
          }
        }
      } else {
        login(null);
        cookies.remove("access_token");
        cookies.remove("refresh_token");
        cookies.remove("token_expires_at");
        cookies.remove("phone_auth_token");
        cookies.remove("phone_refresh_token");
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [ready, cookies, refetch, router, searchParams, login, isExplicitLogin, isPhoneVerified]);

  const logout = async () => {
    setIsAuthenticating(true);

    try {
      await auth.signOut();

      liffLogout();

      const response = await fetch("/api/logout", { method: "POST" });
      if (!response.ok) {
        console.warn("Backend logout failed:", response.status);
      }

      setUser(null);
      setUid(null);

      toast.success("ログアウトしました");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("ログアウトに失敗しました");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const createUser = async (
    name: string,
    currentPrefecture: GqlCurrentPrefecture,
    phoneUid?: string | null,
  ): Promise<Required<Partial<GqlUser>, "id" | "name"> | null> => {
    try {
      const effectivePhoneUid = phoneUid || phoneVerificationState.phoneUid || undefined;
      const phoneNumber = getVerifiedPhoneNumber();
      console.log("Creating user with phone UID:", effectivePhoneUid);
      if (!phoneNumber) {
        throw new Error("No verified phone number found.");
      }

      const { data } = await userSignUpMutation({
        variables: {
          input: {
            name,
            currentPrefecture: currentPrefecture as any, // Type cast to resolve compatibility issue
            communityId: COMMUNITY_ID,
            phoneUid: effectivePhoneUid,
            phoneNumber,
          },
        },
      });

      return data?.userSignUp?.user ?? null;
    } catch (error) {
      console.error("Failed to create user:", error);
      toast.error("ユーザー作成に失敗しました");
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        uid,
        user,
        login,
        logout,
        loginWithLiff,
        isAuthenticating,
        createUser,

        phoneNumber,
        phoneAuth: {
          isVerifying,
          verificationId,
          phoneUid: phoneVerificationState.phoneUid,
          startPhoneVerification,
          verifyPhoneCode: verifyPhoneCodeLocal,
        },
        isPhoneVerified,
        loading: authLoading || gqlLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
