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
  /**
   * @deprecated Legacy field that previously contained hardcoded Japanese text.
   * Use `descriptionData` instead to build internationalized transaction descriptions.
   * This field is now always an empty string and will be removed in a future cleanup.
   */
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
