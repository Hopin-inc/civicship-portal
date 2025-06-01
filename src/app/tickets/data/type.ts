import { GqlTicketStatus } from "@/types/graphql";

export interface TTicket {
  id: string;
  hostName: string;
  hostImage: string;
  quantity: number;
  status: GqlTicketStatus;
}
