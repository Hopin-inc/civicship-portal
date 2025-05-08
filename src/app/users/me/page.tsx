'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/features/user/useUserProfile';
import { useWallet } from '@/hooks/features/wallet/useWallet';
import { UserProfileSection } from '@/components/features/user/UserProfileSection';
import { LoadingIndicator } from '@/components/shared/LoadingIndicator';
import { ErrorState } from '@/components/shared/ErrorState';

export default function MyProfilePage() {
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

  useEffect(() => {
    if (!currentUser) {
      router.push('/login?next=/users/me');
    }
  }, [currentUser, router]);

  if (!currentUser || isProfileLoading || isWalletLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <LoadingIndicator />
      </div>
    );
  }

  if (profileError || walletError) {
    return (
      <div className="container mx-auto px-4 py-6">
        <ErrorState message={
          profileError?.message || 
          walletError?.message || 
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
    </div>
  );
}
