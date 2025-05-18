"use client";

import { useEffect, useRef } from "react";
import { notFound, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import UserProfileSection from "@/app/users/components/UserProfileSection";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import UserPortfolioList from "@/app/users/components/UserPortfolioList";
import { useUserProfile } from "@/app/users/hooks/useUserProfile";
import ErrorState from "@/components/shared/ErrorState";

export default function MyProfilePage() {
  const lastPortfolioRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { user: currentUser, isAuthenticating } = useAuth();

  const { userData, isLoading, error, refetch } = useUserProfile(currentUser?.id);
  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  // 認証完了後、未ログイン状態ならリダイレクト
  useEffect(() => {
    if (!isAuthenticating && !currentUser) {
      router.push("/login?next=/users/me");
    }
  }, [currentUser, isAuthenticating, router]);

  // 認証中の間はローディング
  if (isAuthenticating) {
    return <LoadingIndicator />;
  }

  // 未ログインで useEffect によりリダイレクト中
  if (!currentUser) {
    return null;
  }

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorState title={"マイページを読み込めませんでした"} refetchRef={refetchRef} />;
  }

  if (!userData) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-6 py-6 max-w-3xl">
      <UserProfileSection
        userId={currentUser?.id ?? ""}
        profile={userData.profile}
        userAsset={userData.asset}
        isOwner={true}
      />
      <UserPortfolioList
        userId={currentUser?.id ?? ""}
        isOwner={true}
        portfolios={userData.portfolios}
        isLoadingMore={false}
        hasMore={false}
        lastPortfolioRef={lastPortfolioRef}
        isSysAdmin={false}
        activeOpportunities={userData.currentlyHiringOpportunities}
      />
    </div>
  );
}
