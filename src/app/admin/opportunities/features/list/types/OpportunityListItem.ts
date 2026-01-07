import { GqlOpportunityCategory, GqlPublishStatus } from "@/types/graphql";

export type OpportunityListItem = {
  id: string;
  title: string;
  images: string[];
  category: GqlOpportunityCategory;
  categoryLabel: string;
  description: string;
  publishStatus: GqlPublishStatus;
  publishStatusLabel: string;
  updatedAt: string;
  createdByUserName: string;
};
