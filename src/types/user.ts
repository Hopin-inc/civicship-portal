import { GqlCurrentPrefecture, GqlPortfolioCategory, GqlPortfolioSource, GqlReservationStatus } from "@/types/graphql";
import { ActivityCard, OpportunityCard } from "@/types/opportunity";
import { Participant } from "@/types/utils";
import { UserAsset } from "@/types/wallet";

// ---------------------------------------------
// 👤 基本ユーザー型（すべてのユーザー共通）
// ---------------------------------------------
export type AppUser = {
  id: string;
  profile: GeneralUserProfile;
  portfolios: AppPortfolio[]
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
  image: string | null;
  bio: string | null;
  currentPrefecture?: GqlCurrentPrefecture;

  urlFacebook?: string | null;
  urlInstagram?: string | null;
  urlX?: string | null;
}

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

  title: string;
  image: string | null;
  date: string;

  location: string | null;
  participants: Participant[];
}