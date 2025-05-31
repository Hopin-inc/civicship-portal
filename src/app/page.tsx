"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { useQuery } from "@apollo/client";
import { GET_CURRENT_USER } from "@/graphql/account/identity/query";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import FeaturedSectionSkeleton from "@/app/activities/components/FeaturedSection/FeaturedSectionSkeleton";
import OpportunitiesCarouselSectionSkeleton from "@/app/activities/components/CarouselSection/CarouselSectionSkeleton";
import ListSectionSkeleton from "@/app/activities/components/ListSection/ListSectionSkeleton";
import { AuthRedirectService } from "@/lib/auth/auth-redirect-service";

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isAuthenticating, authenticationState, loading: authLoading } = useAuth();
  const { data: userData, loading: userLoading } = useQuery(GET_CURRENT_USER, {
    skip: !isAuthenticated,
  });

  const authRedirectService = useMemo(() => {
    return AuthRedirectService.getInstance();
  }, []);

  useEffect(() => {
    const isReturnFromLineAuth = searchParams.has("code") && searchParams.has("state") && searchParams.has("liffClientId");
    const nextPath = searchParams.get("liff.state");

    console.log("🔍 HomePage useEffect - checking LINE auth return:", {
      isReturnFromLineAuth,
      nextPath,
      currentUrl: window.location.href,
      searchParamsString: searchParams.toString()
    });

    if (isReturnFromLineAuth) {
      console.log("🚀 Detected return from LINE authentication, liff.state:", nextPath);

      let cleanedNextPath = nextPath;
      if (nextPath?.startsWith("/login?next=")) {
        const urlParams = new URLSearchParams(nextPath.split("?")[1]);
        cleanedNextPath = urlParams.get("next");
        console.log("🔍 Extracted nested next path:", cleanedNextPath);
      } else if (nextPath?.startsWith("/login")) {
        cleanedNextPath = null;
        console.log("🔍 Cleared login path, setting to null");
      }

      console.log("🔍 Final cleaned next path:", cleanedNextPath);
      
      if (cleanedNextPath && typeof window !== "undefined") {
        sessionStorage.setItem("lineAuthRedirectPath", cleanedNextPath);
        console.log("🔍 Stored redirect path in sessionStorage:", cleanedNextPath);
      }

      const cleanedUrl = cleanedNextPath ? `${ window.location.pathname }?next=${ cleanedNextPath }` : window.location.pathname;
      console.log("🔍 Cleaning URL to:", cleanedUrl);
      router.replace(cleanedUrl);

      const redirectPath = authRedirectService.getPostLineAuthRedirectPath(cleanedNextPath);
      console.log("🚀 Authenticated, redirecting to:", redirectPath);
      router.replace(redirectPath);
      return;
    }

    if (typeof window !== "undefined") {
      const storedRedirectPath = sessionStorage.getItem("lineAuthRedirectPath");
      if (storedRedirectPath && isAuthenticated && authenticationState === "user_registered") {
        console.log("🔍 Found stored redirect path, redirecting to:", storedRedirectPath);
        sessionStorage.removeItem("lineAuthRedirectPath");
        router.replace(storedRedirectPath);
        return;
      }
    }

    console.log("🔍 No LINE auth return detected, redirecting to activities");
    router.replace("/activities");
  }, [router, isAuthenticated, authenticationState, userData, authLoading, userLoading, isAuthenticating, authRedirectService, searchParams]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (isAuthenticating || authLoading) {
    return <LoadingIndicator fullScreen={ true } />;
  }

  return (
    <div className="min-h-screen pb-16">
      <FeaturedSectionSkeleton />
      <OpportunitiesCarouselSectionSkeleton title={ "もうすぐ開催予定" } />
      <ListSectionSkeleton />
    </div>
  );
}
