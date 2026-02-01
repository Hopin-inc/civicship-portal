import { isProduction } from "@/lib/environment";

export const getCardanoExplorerTxUrl = (txHash: string) => {
  const baseUrl = isProduction
    ? "https://cardanoscan.io/transaction"
    : "https://preprod.cardanoscan.io/transaction";

  return `${baseUrl}/${txHash}`;
};
