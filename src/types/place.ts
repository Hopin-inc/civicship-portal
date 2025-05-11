import { AppImage, Participant } from "@/types/utils";
import { OpportunityCard } from "@/types/opportunity";
import { ArticleWithAuthor } from "@/types/article";

export type PlacePin = {
  id: string;
  image: string; // 拠点の代表画像（例：施設写真）
  hostImage: string; // 主催者やロゴなどの顔となる画像

  latitude: number;
  longitude: number;
};

export type PlaceCard = PlacePin & {
  name: string; // 拠点名
  address: string;
  headline: string; // 強調キャッチコピー（短文）
  bio: string; // 紹介文（長文）

  publicOpportunityCount: number;
  participantCount: number;
};

export type PlaceDetail = PlaceCard & {
  images: string[];
  totalImageCount: number;

  currentlyHiringOpportunities: OpportunityCard[];
  relatedArticles: ArticleWithAuthor[];
  // pastHistories: PlaceHistoryGrouped;
};

// export type PlaceHistoryGrouped = HistoryYearGroup[];

export type HistoryYearGroup = {
  year: string;
  months: HistoryMonthGroup[];
};

export type HistoryMonthGroup = {
  month: string;
  entries: PlaceHistoryEntry[];
};

export type PlaceHistoryEntry = {
  id: string;
  date: string;
  title: string;
  description: string;

  images: AppImage[];
  totalImageCount: number;

  participants: Participant[];
  participantCount: number;
};
