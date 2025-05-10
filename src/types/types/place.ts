import { AppImage, Participant } from "@/types/types/utils";
import { OpportunityCard } from "@/types/types/opportunity";
import { ArticleWithAuthor } from "@/types/types/article";

export type PlacePin = {
  id: string;
  image: string;        // 拠点の代表画像（例：施設写真）
  hostImage: string;    // 主催者やロゴなどの顔となる画像

  latitude: number;
  longitude: number;
}

export type PlaceCard = PlacePin & {
  name: string;         // 拠点名
  address: string;
  headline: string;     // 強調キャッチコピー（短文）
  bio: string;          // 紹介文（長文）

  publicOpportunityCount: number;
  participantCount: number;
}

export type PlaceDetail = PlaceCard & {
  images: AppImage[];
  totalImageCount: number;

  currentlyHiringOpportunities: OpportunityCard[];
  relatedArticles: ArticleWithAuthor[];
  pastHistories: PlaceHistoryGrouped;
}

type PlaceHistoryGrouped = HistoryYearGroup[];

type HistoryYearGroup = {
  year: string;
  months: HistoryMonthGroup[];
};

type HistoryMonthGroup = {
  month: string;
  entries: PlaceHistoryEntry[];
};

type PlaceHistoryEntry = {
  id: string;
  date: string;
  title: string;
  description: string;

  images: AppImage[];
  totalImageCount: number;

  participants: Participant[];
  participantCount: number;
}