import { GqlTicketStatus } from "@/types/graphql";

export interface Ticket {
  id: string;
  hostName: string;
  hostImage: string;
  quantity: number;
  status: GqlTicketStatus;
}

export interface TicketClaimLink {
  id: string;
  status: string;
  qty: number;
  claimedAt?: Date | null;
  createdAt?: Date | null;
  hostName: string;
  hostImage: string;
  issuer?: {
    id: string;
    owner?: {
      id: string;
      name: string;
      image: string | null;
    };
  };
}   