export const getCardanoExplorerTxUrl = (txHash: string) => {
  const isStaging = process.env.ENV === "staging";
  const isProduction = process.env.NODE_ENV === "production" && !isStaging;

  const baseUrl = isProduction
    ? "https://cardanoscan.io/transaction"
    : "https://preprod.cardanoscan.io/transaction";

  return `${baseUrl}/${txHash}`;
};
