import { AppPortfolio } from "@/app/community/[communityId]/users/features/shared/types";
import { GqlCurrentPrefecture, GqlOpportunityCategory, GqlOpportunitySlot } from "@/types/graphql";

/**
 * ユーザープロフィール画面用のViewModel
 * /users/[id] と /users/me の両方で使用
 *
 * このViewModelはGraphQL型からUI型への変換を行い、
 * プレゼンテーション層で必要な情報を統一的に提供します。
 */

/**
 * ユーザープロフィール画面のViewModel
 */
export type UserProfileViewModel = {
  id: string;
  name: string;
  bio?: string;
  imageUrl?: string;
  currentPrefecture?: GqlCurrentPrefecture;

  socialUrl: {
    x: string | null;
    instagram: string | null;
    facebook: string | null;
  };

  ticketsAvailable?: number;
  points?: number;

  portfolios: AppPortfolio[];

  selfOpportunities: Array<{
    id: string;
    title: string;
    coverUrl?: string;
    category: string;
  }>;

  currentlyHiringOpportunities: Array<{
    id: string;
    title: string;
    images?: string[];
  }>;

  nftInstances?: Array<{
    id: string;
    name: string;
    imageUrl?: string;
    instanceId?: string;
    communityId?: string;
  }>;

  showOpportunities: boolean;
};
