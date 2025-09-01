"use client";

import React, { useEffect, useRef } from "react";
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
import { CardCarousel } from "@/components/shared/CardCarousel";
import OpportunityVerticalCard from "@/components/domains/opportunities/components/OpportunityVerticalCard";
import { formatOpportunities } from "@/components/domains/opportunities/utils";

export default function MyProfilePage() {
  const lastPortfolioRef = useRef<HTMLDivElement>(null);

  const { user: currentUser, isAuthenticating } = useAuth();
  // const { userData, selfOpportunities, isLoading, error, refetch } = useUserProfile(
  //   currentUser?.id,
  // );
  
  // モックデータ
  const userData = {
    profile: {
      name: "モックユーザー",
      image: null,
      imagePreviewUrl: null,
      bio: "これはモックデータです",
      currentPrefecture: undefined,
      urlFacebook: null,
      urlInstagram: null,
      urlX: null,
    },
    asset: {
      points: {
        walletId: "mock-wallet-id",
        currentPoint: BigInt(1000),
      },
      tickets: [],
    },
    portfolios: [],
    currentlyHiringOpportunities: [],
  };
  const selfOpportunities: any[] = [];
  const isLoading = false;
  const error = null;
  const refetch = () => Promise.resolve();
  const { nftInstances } = useUserNfts({ userId: currentUser?.id ?? "" });

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  // 認証中 or リダイレクト待ち → ローディング表示
  if (isAuthenticating || !currentUser) {
    return <LoadingIndicator />;
  }

  // 認証完了してるけど currentUser が null → 何も描画しない（push 発火済み）
  if (!currentUser || isLoading) {
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
