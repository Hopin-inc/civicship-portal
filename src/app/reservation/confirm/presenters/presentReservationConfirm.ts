/**
 * Presenters for reservation confirmation
 * Convert GraphQL types to UI-specific types
 */

import { GqlWalletType } from "@/types/graphql";
import { toNumberSafe } from "../utils/paymentCalculations";

/**
 * Convert GraphQL wallets to current point value
 * Accepts any array-like structure with wallet objects
 */
export function presentUserWallet(wallets: Array<{ type: string; currentPointView?: { currentPoint?: unknown } | null }> | null | undefined): number | null {
  if (!wallets) {
    return null;
  }

  const memberWallet = wallets.find((w: { type: string }) => w.type === GqlWalletType.Member);
  return toNumberSafe(memberWallet?.currentPointView?.currentPoint);
}
