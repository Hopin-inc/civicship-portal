import { GqlTransaction, GqlTransactionReason } from "@/types/graphql";
import { formatCurrency } from "@/utils/transaction";
import { truncateText } from "@/utils/stringUtils";

interface ComputeCardPropsOptions {
  transaction: GqlTransaction;
  perspectiveWalletId?: string;
  showSignedAmount: boolean;
  showDid: boolean;
  info: {
    amount: number;
    isPositive: boolean;
    reason: GqlTransactionReason;
    didValue: string | null;
  };
  to: string;
}

export const computeCardProps = (options: ComputeCardPropsOptions) => {
  const { transaction, perspectiveWalletId, showSignedAmount, showDid, info, to } = options;

  const hasDestination =
    !perspectiveWalletId &&
    Boolean(to) &&
    info.reason !== GqlTransactionReason.PointIssued &&
    info.reason !== GqlTransactionReason.Onboarding;

  const amountClassName =
    showSignedAmount && info.isPositive
      ? "text-label-sm font-bold shrink-0 ml-2 text-success"
      : "text-label-sm font-bold shrink-0 ml-2 text-foreground";

  const formattedAmount =
    showSignedAmount && info.isPositive
      ? `+${formatCurrency(info.amount)}pt`
      : `${formatCurrency(info.amount)}pt`;

  const truncatedDidValue =
    showDid && info.reason !== GqlTransactionReason.PointIssued && info.didValue
      ? truncateText(info.didValue, 20, "middle")
      : null;

  return {
    hasDestination,
    amountClassName,
    formattedAmount,
    truncatedDidValue,
  };
};
