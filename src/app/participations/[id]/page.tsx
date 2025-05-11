'use client';

import { useMemo } from 'react';
import { useHeaderConfig } from '@/hooks/core/useHeaderConfig';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import { ErrorState } from '@/components/shared/ErrorState';
import { useParticipationPage } from "@/hooks/features/participation/useParticipationPage";
import { ParticipationContent } from "@/components/features/participation/ParticipationContext";

interface ParticipationProps {
  params: { id: string };
}

export default function ParticipationPage({ params }: ParticipationProps) {
  const {
    participation,
    opportunity,
    loading,
    error,
    ...rest
  } = useParticipationPage(params.id);

  const headerConfig = useMemo(
    () => ({
      title: opportunity?.title ? `${opportunity.title} - 予約詳細` : '予約詳細',
      showBackButton: true,
      showLogo: false,
      showSearchForm: false,
    }),
    [opportunity?.title]
  );
  useHeaderConfig(headerConfig);

  if (loading) return <LoadingIndicator message="参加情報を読み込み中..." />;
  if (error || !opportunity || !participation) {
    return <ErrorState message="参加情報の読み込みに失敗しました。" />;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 pb-[120px]">
      <ParticipationContent
        opportunity={opportunity}
        participation={participation}
        {...rest}
      />
    </div>
  );
}
