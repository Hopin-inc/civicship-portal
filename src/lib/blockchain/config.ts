/**
 * Blockchain network configuration
 */

export interface BlockchainConfig {
  cardano: {
    explorerBaseUrl: string;
  };
  ethereum: {
    explorerBaseUrl: string;
    contractPath: string;
    tokenPath: string;
  };
}

/**
 * Get blockchain configuration
 * Cardano: Uses Cardanoscan (mainnet)
 * Ethereum: All ERC-721 NFTs use Base Sepolia (Blockscout)
 */
export function getBlockchainConfig(): BlockchainConfig {
  return {
    cardano: {
      explorerBaseUrl: 'https://cardanoscan.io',
    },
    ethereum: {
      explorerBaseUrl: 'https://base-sepolia.blockscout.com',
      contractPath: '/token/{address}',
      tokenPath: '/token/{address}/instance/{tokenId}',
    },
  };
}
