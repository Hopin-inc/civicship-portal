export const getCardanoExplorerTxUrl = (txHash: string) => {
  const isProd = process.env.NODE_ENV === "production";

  const baseUrl = isProd
    ? "https://cardanoscan.io/transaction"
    : "https://preprod.cardanoscan.io/transaction";

  return `${baseUrl}/${txHash}`;
};
