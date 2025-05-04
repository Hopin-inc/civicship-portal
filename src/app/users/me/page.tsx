'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserPortfolios } from '@/hooks/useUserPortfolios';
import { useWallet } from '@/hooks/useWallet';
import { UserProfile } from '@/app/components/features/user/UserProfile';
import { UserPortfolioSection } from '@/app/components/features/user/UserPortfolioSection';
import { UserTicketsAndPoints } from '@/app/components/features/user/UserTicketsAndPoints';
import { LoadingIndicator } from '@/app/components/shared/LoadingIndicator';
import { ErrorState } from '@/app/components/shared/ErrorState';

export default function MyProfilePage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  
  const { 
    profileData, 
    isLoading: isProfileLoading, 
    error: profileError 
  } = useUserProfile();
  
  const { 
    portfolios, 
    isLoading: isPortfoliosLoading, 
    isLoadingMore,
    hasMore,
    error: portfoliosError,
    lastPortfolioRef,
    loadMore
  } = useUserPortfolios(currentUser?.id || '');
  
  const {
    currentPoint,
    ticketCount,
    transactions,
    isLoading: isWalletLoading,
    error: walletError
  } = useWallet(currentUser?.id);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login?next=/users/me');
    }
  }, [currentUser, router]);

  if (!currentUser || isProfileLoading) {
    return <LoadingIndicator />;
  }

  if (profileError) {
    return <ErrorState message={profileError.message} />;
  }

  if (!profileData) {
    return <ErrorState message="ユーザーが見つかりませんでした" />;
  }

  const handleUpdateSocialLinks = async (socialLinks: { type: string; url: string }[]) => {
    // TODO: Implement social links update mutation
    console.log("Update social links:", socialLinks);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <UserProfile
        user={{
          id: profileData.id,
          name: profileData.name,
          image: profileData.image,
          bio: profileData.bio,
          currentPrefecture: profileData.currentPrefecture,
          socialLinks: profileData.socialLinks
        }}
        isOwner={true}
        onUpdateSocialLinks={handleUpdateSocialLinks}
      />

      <UserTicketsAndPoints
        ticketCount={ticketCount}
        pointCount={currentPoint}
      />

      <UserPortfolioSection
        portfolios={portfolios}
        isLoading={isPortfoliosLoading}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        lastPortfolioRef={lastPortfolioRef}
        onLoadMore={loadMore}
      />
    </div>
  );
}
