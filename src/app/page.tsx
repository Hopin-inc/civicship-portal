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
import clientLogger from "@/lib/logging/client";

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
    if (authLoading || userLoading || isAuthenticating) {
      clientLogger.debug("HomePage: Still loading, skipping redirect logic", {
        component: "HomePage"
      });
      return;
    }

    const isReturnFromLineAuth = searchParams.has("code") && searchParams.has("state") && searchParams.has("liffClientId");
    const nextPath = searchParams.get("liff.state");

    clientLogger.debug("HomePage useEffect - checking LINE auth return", {
      isReturnFromLineAuth,
      nextPath,
      currentUrl: window.location.href,
      searchParamsString: searchParams.toString(),
      authenticationState,
      isAuthenticated,
      component: "HomePage"
    });

    if (isReturnFromLineAuth) {
      clientLogger.debug("Detected return from LINE authentication", {
        nextPath,
        component: "HomePage"
      });

      let cleanedNextPath = nextPath;
      if (nextPath?.startsWith("/login?next=")) {
        const urlParams = new URLSearchParams(nextPath.split("?")[1]);
        cleanedNextPath = urlParams.get("next");
        clientLogger.debug("Extracted nested next path", {
          cleanedNextPath,
          component: "HomePage"
        });
      } else if (nextPath?.startsWith("/login")) {
        cleanedNextPath = null;
        clientLogger.debug("Cleared login path, setting to null", {
          component: "HomePage"
        });
      }

      clientLogger.debug("Final cleaned next path", {
        cleanedNextPath,
        component: "HomePage"
      });

      const cleanedUrl = cleanedNextPath ? `${window.location.pathname}?next=${cleanedNextPath}` : window.location.pathname;
      clientLogger.debug("Cleaning URL", {
        cleanedUrl,
        component: "HomePage"
      });
      router.replace(cleanedUrl);

      if (isAuthenticated && authenticationState === "user_registered") {
        const redirectPath = authRedirectService.getPostLineAuthRedirectPath(cleanedNextPath);
        clientLogger.debug("Authenticated and registered, redirecting", {
          redirectPath,
          component: "HomePage"
        });
        router.replace(redirectPath);
      } else {
        clientLogger.debug("Waiting for authentication state to be ready", {
          component: "HomePage"
        });
      }
      return;
    }

    clientLogger.debug("No LINE auth return detected, redirecting to activities", {
      component: "HomePage"
    });
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
