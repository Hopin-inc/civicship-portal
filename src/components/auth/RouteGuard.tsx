"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { useQuery } from "@apollo/client";
import { GET_CURRENT_USER } from "@/graphql/account/identity/query";

/**
 * 認証が必要なページのパスパターン
 */
const PROTECTED_PATHS = [
  "/users/me",
  "/admin",
  "/my-activities",
  "/my-points",
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
  return PROTECTED_PATHS.some((protectedPath) => path.startsWith(protectedPath));
};

/**
 * パスが電話番号認証が必要なパスかどうかを確認
 * @param path 確認するパス
 * @returns 電話番号認証が必要なパスの場合はtrue
 */
const isPhoneVerificationRequiredPath = (path: string): boolean => {
  return PHONE_VERIFICATION_REQUIRED_PATHS.some((requiredPath) => path.startsWith(requiredPath));
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
  const { isAuthenticated, isPhoneVerified, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  
  const { data: userData, loading: userLoading } = useQuery(GET_CURRENT_USER, {
    skip: !isAuthenticated,
  });
  
  const isUserRegistered = userData?.currentUser != null;
  
  useEffect(() => {
    if (loading || userLoading) {
      return;
    }
    
    const authCheck = () => {
      if (isProtectedPath(pathname)) {
        if (!isAuthenticated) {
          setAuthorized(false);
          router.push("/login");
        } else if (!isUserRegistered) {
          setAuthorized(false);
          router.push("/sign-up/phone-verification");
        } else {
          setAuthorized(true);
        }
      }
      else if (isPhoneVerificationRequiredPath(pathname)) {
        if (!isAuthenticated) {
          setAuthorized(false);
          router.push("/login");
        } else if (!isPhoneVerified && pathname !== "/sign-up/phone-verification") {
          setAuthorized(false);
          router.push("/sign-up/phone-verification");
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
    
    return () => {
    };
  }, [pathname, isAuthenticated, isPhoneVerified, isUserRegistered, loading, userLoading, router]);
  
  if (loading || userLoading) {
    return null;
  }
  
  return authorized ? <>{children}</> : null;
};
