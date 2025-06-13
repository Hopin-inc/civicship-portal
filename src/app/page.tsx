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
    if (authLoading || userLoading || isAuthenticating) return;

    const isReturnFromLineAuth = searchParams.has("code") && searchParams.has("state") && searchParams.has("liffClientId");
    const nextPath = searchParams.get("liff.state");

    if (isReturnFromLineAuth) {
      let cleanedNextPath = nextPath;
      
      if (nextPath?.includes("?next=")) {
        try {
          const url = new URL(`https://dummy.com${nextPath}`);
          cleanedNextPath = url.searchParams.get("next");
        } catch {
          const nextMatch = nextPath.match(/[?&]next=([^&]*)/);
          cleanedNextPath = nextMatch ? decodeURIComponent(nextMatch[1]) : null;
        }
      } else if (nextPath?.startsWith("/login?next=")) {
        const urlParams = new URLSearchParams(nextPath.split("?")[1]);
        cleanedNextPath = urlParams.get("next");
      } else if (nextPath?.startsWith("/login")) {
        cleanedNextPath = null;
      }

      const cleanedUrl = cleanedNextPath ? `${window.location.pathname}?next=${cleanedNextPath}` : window.location.pathname;
      router.replace(cleanedUrl);

      if (isAuthenticated && authenticationState === "user_registered") {
        const redirectPath = authRedirectService.getPostLineAuthRedirectPath(cleanedNextPath);
        router.replace(redirectPath);
      }
      return;
    }

    router.replace("/activities");
  }, [authLoading, authRedirectService, authenticationState, isAuthenticated, isAuthenticating, router, searchParams, userLoading]);

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
