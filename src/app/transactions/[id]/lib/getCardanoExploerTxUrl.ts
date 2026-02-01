export const getCardanoExplorerTxUrl = (txHash: string) => {
  const { isProduction } = require("@/lib/environment");

  const baseUrl = isProduction
    ? "https://cardanoscan.io/transaction"
    : "https://preprod.cardanoscan.io/transaction";

  return `${baseUrl}/${txHash}`;
};
