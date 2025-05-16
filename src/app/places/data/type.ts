import { AppImage, Participant } from "@/types/utils";
import { ActivityCard } from "@/app/activities/data/type";
import { TArticleWithAuthor } from "@/app/articles/data/type";

export type BasePin = {
  id: string;
  image: string; // 拠点の代表画像（例：施設写真）
  host: BaseHost;

  latitude: number;
  longitude: number;
  address: string;
};

export type BaseHost = {
  id: string;
  name: string;
  image: string | null;
  bio: string;
};

export type BaseCardInfo = BasePin & {
  name: string; // 拠点名
  address: string;
  headline: string; // 強調キャッチコピー（短文）
  bio: string; // 紹介文（長文）

  publicOpportunityCount: number;
  participantCount: number;

  communityId: string;
};

export type BaseDetail = BaseCardInfo & {
  images: string[];
  totalImageCount: number;

  currentlyHiringOpportunities: ActivityCard[];
  relatedArticles: TArticleWithAuthor[];
  // pastHistories: BaseHistoryGrouped;
};

// export type BaseHistoryGrouped = HistoryYearGroup[];

export type HistoryYearGroup = {
  year: string;
  months: HistoryMonthGroup[];
};

export type HistoryMonthGroup = {
  month: string;
  entries: BaseHistoryEntry[];
};

export type BaseHistoryEntry = {
  id: string;
  date: string;
  title: string;
  description: string;

  images: AppImage[];
  totalImageCount: number;

  participants: Participant[];
  participantCount: number;
};
