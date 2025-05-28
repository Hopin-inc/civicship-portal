"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { useQuery } from "@apollo/client";
import { GET_CURRENT_USER } from "@/graphql/account/identity/query";
import { matchPaths } from "@/utils/path";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

/**
 * 認証が必要なページのパスパターン
 */
const PROTECTED_PATHS = [
  "/users/me",
  "/tickets",
  "/wallets",
  "/wallets/*",
  "/admin",
  "/admin/*",
];

/**
 * 電話番号認証が必要なページのパスパターン
 */
const PHONE_VERIFICATION_REQUIRED_PATHS = [
  "/sign-up",
];

/**
 * パスが保護されたパスかどうかを確認
 * @param path 確認するパス
 * @returns 保護されたパスの場合はtrue
 */
const isProtectedPath = (path: string): boolean => {
  return matchPaths(path, ...PROTECTED_PATHS);
};

/**
 * パスが電話番号認証が必要なパスかどうかを確認
 * @param path 確認するパス
 * @returns 電話番号認証が必要なパスの場合はtrue
 */
const isPhoneVerificationRequiredPath = (path: string): boolean => {
  return matchPaths(path, ...PHONE_VERIFICATION_REQUIRED_PATHS);
};

/**
 * ルートガードコンポーネントのプロパティ
 */
interface RouteGuardProps {
  children: React.ReactNode;
}

/**
 * ルートガードコンポーネント
 * 認証状態に基づいてページアクセスを制御する
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const { isAuthenticated, isPhoneVerified, isUserRegistered, authenticationState, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  const { loading: userLoading } = useQuery(GET_CURRENT_USER, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (loading || userLoading) {
      return;
    }

    const authCheck = () => {
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      
      if (isProtectedPath(pathname)) {
        if (authenticationState === "unauthenticated" || authenticationState === "loading") {
          setAuthorized(false);
          router.replace(`/login?next=${next}`);
        } else if (authenticationState === "line_authenticated" || authenticationState === "line_token_expired") {
          setAuthorized(false);
          router.replace(`/sign-up/phone-verification?next=${next}`);
        } else if (authenticationState === "phone_authenticated" || authenticationState === "phone_token_expired") {
          setAuthorized(false);
          router.replace(`/sign-up?next=${next}`);
        } else if (authenticationState === "user_registered") {
          setAuthorized(true);
        }
      } 
      else if (isPhoneVerificationRequiredPath(pathname)) {
        if (authenticationState === "unauthenticated" || authenticationState === "loading") {
          setAuthorized(false);
          router.replace(`/login?next=${next}`);
        } else if ((authenticationState === "line_authenticated" || authenticationState === "line_token_expired") && 
                   pathname !== "/sign-up/phone-verification") {
          setAuthorized(false);
          router.replace(`/sign-up/phone-verification?next=${next}`);
        } else {
          setAuthorized(true);
        }
      }
      else {
        setAuthorized(true);
      }
    };

    authCheck();

    const handleRouteChange = () => {
      authCheck();
    };

    return () => {};
  }, [pathname, authenticationState, loading, userLoading, router]);

  if (loading || userLoading) {
    return <LoadingIndicator />;
  }

  return authorized ? <>{children}</> : null;
};
