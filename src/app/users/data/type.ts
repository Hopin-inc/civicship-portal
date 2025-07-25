import {
  GqlCurrentPrefecture,
  GqlEvaluationStatus,
  GqlPortfolioCategory,
  GqlPortfolioSource,
  GqlReservationStatus,
} from "@/types/graphql";
import { ActivityCard } from "@/app/activities/data/type";
import { Participant } from "@/types/utils";
import { UserAsset } from "@/app/wallets/data/type";

// ---------------------------------------------
// 👤 基本ユーザー型（すべてのユーザー共通）
// ---------------------------------------------
export type AppUser = {
  id: string;
  profile: GeneralUserProfile;
  portfolios: AppPortfolio[];
};

export type AppUserSelf = AppUser & {
  asset: UserAsset;
};

export type ManagerProfile = AppUser & {
  asset: UserAsset;
  currentlyHiringOpportunities: ActivityCard[];
};

// ---------------------------------------------
// 🧑‍💼 プロフィール情報（公開・非公開）
// ---------------------------------------------
export type GeneralUserProfile = PublicUserProfile & Partial<PrivateUserProfile>;

export type PublicUserProfile = {
  name: string;
  image: string | File | null;
  imagePreviewUrl?: string | null;
  bio: string | null;
  currentPrefecture?: GqlCurrentPrefecture;

  urlFacebook?: string | null;
  urlInstagram?: string | null;
  urlX?: string | null;
};

export type PrivateUserProfile = {
  phone: string;
};

// ---------------------------------------------
// 📁 ポートフォリオ
// ---------------------------------------------
export type AppPortfolio = {
  id: string;
  source: GqlPortfolioSource;
  category: GqlPortfolioCategory;

  reservationStatus?: GqlReservationStatus | null;
  evaluationStatus?: GqlEvaluationStatus | null;
  title: string;
  image: string | null;
  date: string;

  location: string | null;
  participants: Participant[];
};
