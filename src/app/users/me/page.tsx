"use client";

import React, { useEffect, useRef } from "react";
import { notFound, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import UserProfileSection from "@/app/users/components/UserProfileSection";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import UserPortfolioList from "@/app/users/components/UserPortfolioList";
import { useUserProfile } from "@/app/users/hooks/useUserProfile";
import ErrorState from "@/components/shared/ErrorState";
import OpportunityCardVertical from "@/app/opportunities/components/Card/CardVertical";
import { AuthRedirectService } from "@/lib/auth/auth-redirect-service";

export default function MyProfilePage() {
  const lastPortfolioRef = useRef<HTMLDivElement>(null);

  const { user: currentUser, isAuthenticating } = useAuth();
  const { userData, selfOpportunities, isLoading, error, refetch } = useUserProfile(
    currentUser?.id,
  );

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  // 認証中 or リダイレクト待ち → ローディング表示
  if (isAuthenticating || !currentUser) {
    return <LoadingIndicator />;
  }

  // 認証完了してるけど currentUser が null → 何も描画しない（push 発火済み）
  if (!currentUser) {
    return null;
  }

  // データ取得中
  if (isLoading) {
    return <LoadingIndicator />;
  }

  // エラー
  if (error) {
    return <ErrorState title={"マイページを読み込めませんでした"} refetchRef={refetchRef} />;
  }

  // データがない → notFound()
  if (!userData) {
    return notFound();
  }

  // 正常表示
  return (
    <div className="container mx-auto px-6 py-6 max-w-3xl">
      <UserProfileSection
        userId={currentUser?.id ?? ""}
        profile={userData.profile}
        userAsset={userData.asset}
        isOwner={true}
      />
      {selfOpportunities.length > 0 && (
        <>
          <section className="py-6 mt-0">
            <h2 className="text-display-sm font-semibold text-foreground pt-4 pb-1">
              主催中の体験
            </h2>
            <div className="mt-4 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {selfOpportunities.map((opportunity) => (
                <OpportunityCardVertical
                  key={opportunity.id}
                  opportunity={opportunity}
                  isCarousel
                />
              ))}
            </div>
          </section>
        </>
      )}
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
