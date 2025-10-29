import { GqlTransactionReason } from "@/types/graphql";

export interface TransactionDescriptionData {
  actionType?: "donation" | "grant" | "payment" | "return" | "refund";
  direction?: "to" | "from";
  name: string;
  isSpecialCase: boolean;
}

export type AppTransaction = {
  id: string;
  reason: GqlTransactionReason;
  description: string;
  descriptionData?: TransactionDescriptionData;
  comment: string;
  source: string;

  from: string;
  to: string;
  transferPoints: number;

  transferredAt: string;
  didValue: string | null;
  image?: string;
};
