'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { CurrentPrefecture } from '@/gql/graphql';
import { toast } from 'sonner';

export interface SignUpFormValues {
  name: string;
  prefecture: CurrentPrefecture | undefined;
}

export const prefectureLabels: Record<CurrentPrefecture, string> = {
  [CurrentPrefecture.Kagawa]: '香川県',
  [CurrentPrefecture.Tokushima]: '徳島県',
  [CurrentPrefecture.Kochi]: '高知県',
  [CurrentPrefecture.Ehime]: '愛媛県',
  [CurrentPrefecture.OutsideShikoku]: '四国以外',
  [CurrentPrefecture.Unknown]: '不明',
} as const;

export const prefectureOptions = [
  CurrentPrefecture.Kagawa,
  CurrentPrefecture.Tokushima,
  CurrentPrefecture.Kochi,
  CurrentPrefecture.Ehime,
];

/**
 * Custom hook for managing sign-up functionality
 */
export const useSignUp = () => {
  const router = useRouter();
  const { createUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (values: SignUpFormValues) => {
    if (!values.prefecture) {
      toast.error('居住地を選択してください。');
      return;
    }

    setIsLoading(true);
    try {
      const user = await createUser(values.name, values.prefecture);
      if (user) {
        toast.success('アカウントが作成されました');
        router.push('/');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('アカウント作成に失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSignUp,
    prefectureOptions,
    prefectureLabels,
  };
};

export default useSignUp;
