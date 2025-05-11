import { GqlTicketStatus } from "@/types/graphql";

export interface Ticket {
  id: string;
  hostName: string;
  hostImage: string;
  quantity: number;
  status: GqlTicketStatus;
  utilityId?: string;
  createdByUser?: {
    id: string;
    name: string;
    image: string | null;
  };
} 