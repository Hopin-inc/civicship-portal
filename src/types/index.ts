
export type RelatedArticle = {
  title: string;
  url: string;
  type: "interview" | "article";
  image?: string;
  description?: string;
  publishedAt: string;
};

export type ArticleType = "activity_report" | "interview" | "column";

export type Article = {
  id: string;
  title: string;
  description: string;
  introduction: string;
  content: string;
  type: ArticleType;
  thumbnail: string;
  publishedAt: string;
  author: {
    name: string;
    image: string;
    bio?: string;
  };
  createdAt: string;
  updatedAt: string | null;
};

export type Activity = {
  id: string;
  title: string;
  description: string;
  communityId: string;
  price: number;
  duration: number; // minutes
  location: {
    name: string;
    address: string;
    prefecture: string;
    city: string;
    lat?: number;
    lng?: number;
  };
  images: string[];
  capacity: number;
  participants?: User[];
  schedule: {
    startTime: string;
    endTime: string;
    daysOfWeek: number[]; // 0-6, 0 is Sunday
  };
  timeSchedule: {
    time: string;
    description: string;
  }[];
  precautions: string[];
  host: {
    name: string;
    image: string;
    bio: string;
  };
  status: "open" | "closed";
  createdAt: string;
  updatedAt: string;
};

export type Participant = {
  id: string;
  name: string;
  image: string | null;
};

export type ParticipationImage = {
  id: string;
  url: string;
  caption: string | null;
  participationId: string;
  createdAt: string;
  updatedAt: string;
};

export type Participation = {
  node: {
    id: string;
    status: string;
    reason: string;
    images?: ParticipationImage[];
    user: {
      id: string;
      name: string;
      image: string | null;
    };
    reservation?: {
      id: string;
      opportunitySlot: {
        id: string;
        capacity: number;
        startsAt: Date | string;
        endsAt: Date | string;
        hostingStatus: string;
      };
      participations?: Array<{
        id: string;
        user: {
          id: string;
          name: string;
          image: string | null;
        };
      }>;
    };
  };
};

export type ContentType = "EXPERIENCE" | "QUEST" | "EVENT" | "ARTICLE";

export type DateFilter = {
  startDate: Date | null;
  endDate: Date | null;
};

export type OpportunityEdge = {
  node: Opportunity;
};

export type OpportunityConnection = {
  edges: OpportunityEdge[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string;
  };
  totalCount?: number;
};

export type GetOpportunitiesData = {
  upcoming: OpportunityConnection;
  featured: OpportunityConnection;
  all: OpportunityConnection;
};
