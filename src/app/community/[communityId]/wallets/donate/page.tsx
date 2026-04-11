import { getServerMyWalletWithTransactions } from "@/app/community/[communityId]/wallets/features/shared/server/getServerMyWalletWithTransactions";
import DonatePointPageClient from "./DonatePointPageClient";

export const dynamic = "force-dynamic";

export default async function DonatePointPage() {
  const result = await getServerMyWalletWithTransactions({ first: 0 });
  const initialCurrentPoint = result.wallet?.currentPoint?.toString() ?? "0";
  return <DonatePointPageClient initialCurrentPoint={initialCurrentPoint} />;
}
