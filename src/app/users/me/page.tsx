'use client';

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/features/user/useUserProfile';
import { useWallet } from '@/hooks/features/wallet/useWallet';
import { UserProfileSection } from '@/components/features/user/UserProfileSection';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import { ErrorState } from '@/components/shared/ErrorState';
import { useHeaderConfig } from '@/hooks/core/useHeaderConfig';
import { useUserPortfolios } from "@/hooks/features/user/useUserPortfolios";
import { UserPortfolioList } from "@/components/features/user/UserPortfolioList";


export default function MyProfilePage() {
  const lastPortfolioRef = useRef<HTMLDivElement>(null);
  const headerConfig = useMemo(() => ({
    title: "マイページ",
    showLogo: true,
    showBackButton: false,
    showSearchForm: false,
  }), [])
  useHeaderConfig(headerConfig);

  const router = useRouter();
  const { user: currentUser } = useAuth();

  const {
    profileData,
    isLoading: isProfileLoading,
    error: profileError
  } = useUserProfile(currentUser?.id);

  const {
    currentPoint,
    ticketCount,
    isLoading: isWalletLoading,
    error: walletError
  } = useWallet(currentUser?.id);

  const {
    portfolios,
    isLoading: isPortfoliosLoading,
    error: portfoliosError,
    activeOpportunities
  } = useUserPortfolios(currentUser?.id ?? "");

  useEffect(() => {
    if (!currentUser) {
      router.push('/login?next=/users/me');
    }
  }, [currentUser, router]);

  if (!currentUser || isProfileLoading || isWalletLoading || isPortfoliosLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <LoadingIndicator />
      </div>
    );
  }

  if (profileError || walletError || portfoliosError) {
    return (
      <div className="container mx-auto px-4 py-6">
        <ErrorState message={
          profileError?.message ||
          walletError?.message ||
          portfoliosError?.message ||
          "ユーザー情報の取得に失敗しました"
        } />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="container mx-auto px-4 py-6">
        <ErrorState message="ユーザーが見つかりませんでした" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <UserProfileSection
        userId={currentUser.id}
        isLoading={isProfileLoading}
        error={profileError}
        profileData={{
          ...profileData,
          ticketCount,
          pointCount: currentPoint
        }}
        isOwner={true}
      />
      <UserPortfolioList
        userId={currentUser.id}
        isOwner={true}
        portfolios={portfolios}
        isLoadingMore={false}
        hasMore={false}
        lastPortfolioRef={lastPortfolioRef}
        isSysAdmin={false}
        activeOpportunities={activeOpportunities}
      />
    </div>
  );
}
