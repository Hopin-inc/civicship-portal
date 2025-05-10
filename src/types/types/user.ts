import { GqlCurrentPrefecture, GqlPortfolioCategory, GqlPortfolioSource, GqlReservationStatus } from "@/types/graphql";
import { OpportunityCard } from "@/types/types/opportunity";
import { Participant } from "@/types/types/utils";

// ---------------------------------------------
// 👤 基本ユーザー型（すべてのユーザー共通）
// ---------------------------------------------
export type AppUser = {
  id: string;
  profile: UserProfile;
  portfolios: Portfolio[]
};

export type AppUserSelf = AppUser & {
  asset: Asset;
};

export type ManagerProfile = AppUser & {
  currentlyHiringOpportunities: OpportunityCard[];
};

// ---------------------------------------------
// 🧑‍💼 プロフィール情報（公開・非公開）
// ---------------------------------------------
export type UserProfile = PublicUserProfile & Partial<PrivateUserProfile>;

type PublicUserProfile = {
  name: string;
  image: string | null;
  bio: string | null;
  currentPrefecture?: GqlCurrentPrefecture;

  urlFacebook?: string | null;
  urlInstagram?: string | null;
  urlX?: string | null;
}

type PrivateUserProfile = {
  phone: string;
};

// ---------------------------------------------
// 💰 資産情報（自分のみアクセス可能）
// ---------------------------------------------
type Asset = {
  tickets: AvailableTicket;
  points: AvailablePoint;
}

type AvailableTicket = {
  id: string;
  quantity: number;
}

type AvailablePoint = {
  id: string;
  amount: number;
}

// ---------------------------------------------
// 📁 ポートフォリオ（実績または参加予定）
// ---------------------------------------------
type Portfolio = {
  id: string;
  source: typeof GqlPortfolioSource;
  category: typeof GqlPortfolioCategory;

  reservationStatus?: typeof GqlReservationStatus | null;

  title: string;
  image: string | null;
  date: string;

  location: string | null;
  participants: Participant[];
}