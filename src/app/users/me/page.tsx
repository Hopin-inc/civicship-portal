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
import CardVertical from "@/app/components/CardVertical";
import { NftCard } from "@/components/domains/nfts/components";
import { logger } from "@/lib/logging";

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
    setPerformanceLog(prev => ({ ...prev, pageStart: startTime }));
    logger.info("MyProfilePage: ページ読み込み開始", {
      timestamp: startTime,
      component: "MyProfilePage"
    });
  }, []);

  const { user: currentUser, isAuthenticating } = useAuth();
  
  useEffect(() => {
    if (currentUser) {
      const authCompleteTime = performance.now();
      setPerformanceLog(prev => {
        const authDuration = authCompleteTime - (prev.pageStart || authCompleteTime);
        logger.info("MyProfilePage: 認証完了", {
          timestamp: authCompleteTime,
          authDuration: `${authDuration.toFixed(2)}ms`,
          userId: currentUser.id,
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
        const profileDuration = profileCompleteTime - (prev.authComplete || prev.pageStart || profileCompleteTime);
        logger.info("MyProfilePage: ユーザープロフィール読み込み完了", {
          timestamp: profileCompleteTime,
          profileDuration: `${profileDuration.toFixed(2)}ms`,
          totalDuration: `${(profileCompleteTime - (prev.pageStart || profileCompleteTime)).toFixed(2)}ms`,
          hasOpportunities: selfOpportunities.length > 0,
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
        const nftDuration = nftCompleteTime - (prev.profileComplete || prev.pageStart || nftCompleteTime);
        const totalDuration = nftCompleteTime - (prev.pageStart || nftCompleteTime);
        logger.info("MyProfilePage: NFTデータ読み込み完了", {
          timestamp: nftCompleteTime,
          nftDuration: `${nftDuration.toFixed(2)}ms`,
          totalDuration: `${totalDuration.toFixed(2)}ms`,
          nftCount: nftInstances.length,
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
        const nftStartTime = performance.now();
        logger.info("MyProfilePage: NFT読み込み開始", {
          timestamp: nftStartTime,
          component: "MyProfilePage"
        });
        setShowNfts(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [userData, isLoading]);

  // 認証中またはメインデータ読み込み中 → ローディング表示
  if (isAuthenticating || !currentUser || isLoading) {
    logger.info("MyProfilePage: ローディング表示中", {
      isAuthenticating,
      hasCurrentUser: !!currentUser,
      isLoading,
      timestamp: performance.now(),
      component: "MyProfilePage"
    });
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

  // 正常表示
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
            {selfOpportunities.length > 0 && (
              <section className="py-6 mt-0">
                <h2 className="text-display-sm font-semibold text-foreground pt-4 pb-1">
                  主催中の体験
                </h2>
                <div className="mt-4 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {selfOpportunities.map((opportunity) => (
                    <CardVertical
                      key={opportunity.id}
                      opportunity={opportunity}
                      isCarousel
                    />
                  ))}
                </div>
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
