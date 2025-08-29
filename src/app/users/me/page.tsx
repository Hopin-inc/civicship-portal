"use client";

import React, { useEffect, useRef, useState } from "react";
import { notFound } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import UserProfileSection from "@/app/users/components/UserProfileSection";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import UserPortfolioList from "@/app/users/components/UserPortfolioList";
import { useUserProfile } from "@/app/users/hooks/useUserProfile";
import { ErrorState } from '@/components/shared'
import { currentCommunityConfig } from "@/lib/communities/metadata";
import { useUserNfts } from "@/components/domains/nfts/hooks/useUserNft";
import { NftCard } from "@/components/domains/nfts/components";
import { logger } from "@/lib/logging";
import { CardCarousel } from "@/components/shared/CardCarousel";
import OpportunityVerticalCard from "@/components/domains/opportunities/components/OpportunityVerticalCard";
import { formatOpportunities } from "@/components/domains/opportunities/utils";

interface PerformanceLog {
  pageStart?: number;
  authComplete?: number;
  profileComplete?: number;
  nftComplete?: number;
}

export default function MyProfilePage() {
  const lastPortfolioRef = useRef<HTMLDivElement>(null);
  const [showNfts, setShowNfts] = useState(false);
  const [performanceLog, setPerformanceLog] = useState<PerformanceLog>({});

  useEffect(() => {
    const startTime = performance.now();
    const requestId = `page-${startTime}`;
    setPerformanceLog(prev => ({ ...prev, pageStart: startTime }));
    logger.info("🚀 [REQUEST START] MyProfilePage読み込み開始", {
      requestId,
      component: "MyProfilePage"
    });
  }, []);

  const { user: currentUser, isAuthenticating } = useAuth();
  
  useEffect(() => {
    if (currentUser) {
      const authCompleteTime = performance.now();
      setPerformanceLog(prev => {
        const authDuration = authCompleteTime - (prev.pageStart || authCompleteTime);
        logger.info("✅ 認証完了", {
          authDuration: `${authDuration.toFixed(2)}ms`,
          requestId: `page-${prev.pageStart}`,
          component: "MyProfilePage"
        });
        return { ...prev, authComplete: authCompleteTime };
      });
    }
  }, [currentUser]);

  const { userData, selfOpportunities, isLoading, error, refetch } = useUserProfile(
    currentUser?.id,
  );
  
  useEffect(() => {
    if (userData && !isLoading) {
      const profileCompleteTime = performance.now();
      setPerformanceLog(prev => {
        const totalDuration = profileCompleteTime - (prev.pageStart || profileCompleteTime);
        logger.info("✅ [REQUEST END] プロフィール読み込み完了", {
          totalDuration: `${totalDuration.toFixed(2)}ms`,
          requestId: `page-${prev.pageStart}`,
          component: "MyProfilePage"
        });
        return { ...prev, profileComplete: profileCompleteTime };
      });
    }
  }, [userData, isLoading, selfOpportunities]);
  
  const { nftInstances } = useUserNfts({ 
    userId: showNfts ? (currentUser?.id ?? "") : ""
  });
  
  useEffect(() => {
    if (showNfts && nftInstances.length >= 0) {
      const nftCompleteTime = performance.now();
      setPerformanceLog(prev => {
        const totalDuration = nftCompleteTime - (prev.pageStart || nftCompleteTime);
        logger.info("🎨 NFT読み込み完了", {
          totalDuration: `${totalDuration.toFixed(2)}ms`,
          nftCount: nftInstances.length,
          requestId: `page-${prev.pageStart}`,
          component: "MyProfilePage"
        });
        return { ...prev, nftComplete: nftCompleteTime };
      });
    }
  }, [showNfts, nftInstances]);

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  useEffect(() => {
    if (userData && !isLoading) {
      const timer = setTimeout(() => {
        setShowNfts(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [userData, isLoading]);

  // 認証中またはメインデータ読み込み中 → ローディング表示
  if (isAuthenticating || !currentUser || isLoading) {
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

  const targetFeatures = ["opportunities", "credentials"] as const;
  const shouldShowOpportunities = targetFeatures.some((feature) =>
    currentCommunityConfig.enableFeatures.includes(feature),
  );

  const formattedOpportunities = selfOpportunities.map(formatOpportunities);

  return (
    <div className="container mx-auto px-6 py-6 max-w-3xl">
      <UserProfileSection
        userId={currentUser?.id ?? ""}
        profile={userData.profile}
        userAsset={userData.asset}
        isOwner={true}
      />
      {nftInstances && nftInstances.length > 0 ? (
        <section className="py-6 mt-0">
          <h2 className="text-display-sm font-semibold text-foreground pt-4 pb-1">
            証明書
          </h2>
          <div className="mt-4 flex gap-4 overflow-x-auto scrollbar-hide">
            {nftInstances.map((nftInstance) => (
              <NftCard
                key={nftInstance.id}
                nftInstance={nftInstance}
                isCarousel={true}
              />
            ))}
          </div>
        </section>
      ) : (
        null
      )}
      <>
        {shouldShowOpportunities && (
          <>
            {formattedOpportunities.length > 0 && (
              <section className="py-6 mt-0">
                <h2 className="text-display-sm font-semibold text-foreground pt-4 pb-1">
                  主催中の体験
                </h2>
                <CardCarousel>
                  {formattedOpportunities.map((opportunity) => (
                    <OpportunityVerticalCard
                      key={opportunity.id}
                      {...opportunity}
                    />
                  ))}
                </CardCarousel>
              </section>
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
          </>
        )}
      </>
    </div>
  );
}
