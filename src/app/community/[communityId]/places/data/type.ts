import { AppImage, Participant } from "@/types/utils";
import { ActivityCard } from "@/components/domains/opportunities/types";
import { TArticleWithAuthor } from "@/app/community/[communityId]/articles/data/type";

export type IPlacePin = {
  id: string;
  image: string; // 拠点の代表画像（例：施設写真）
  host: IPlaceHost;

  latitude: number;
  longitude: number;
  address: string;
};

export type IPlaceHost = {
  id: string;
  name: string;
  image: string | null;
  bio: string;
};

export type IPlaceCard = IPlacePin & {
  name: string; // 拠点名
  address: string;
  headline: string; // 強調キャッチコピー（短文）
  bio: string; // 紹介文（長文）

  publicOpportunityCount: number;
  participantCount: number;

  communityId: string;
};

export type IPlaceDetail = IPlaceCard & {
  images: string[];
  totalImageCount: number;

  currentlyHiringOpportunities: ActivityCard[];
  relatedArticles: TArticleWithAuthor[];
  // pastHistories: PlaceHistoryGrouped;
};

// export type PlaceHistoryGrouped = HistoryYearGroup[];

export type IHistoryYearGroup = {
  year: string;
  months: IHistoryMonthGroup[];
};

export type IHistoryMonthGroup = {
  month: string;
  entries: IPlaceHistoryEntry[];
};

export type IPlaceHistoryEntry = {
  id: string;
  date: string;
  title: string;
  description: string;

  images: AppImage[];
  totalImageCount: number;

  participants: Participant[];
  participantCount: number;
};
