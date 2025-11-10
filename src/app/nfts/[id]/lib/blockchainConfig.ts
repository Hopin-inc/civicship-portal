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
 * Blockchain configuration
 * Cardano: Uses Cardanoscan (mainnet)
 * Ethereum: All ERC-721 NFTs use Base Sepolia (Blockscout)
 */
export const blockchainConfig: BlockchainConfig = {
  cardano: {
    explorerBaseUrl: 'https://cardanoscan.io',
  },
  ethereum: {
    explorerBaseUrl: 'https://base-sepolia.blockscout.com',
    contractPath: '/token/{address}',
    tokenPath: '/token/{address}/instance/{tokenId}',
  },
};

/**
 * Get blockchain configuration
 * @deprecated Use blockchainConfig constant instead
 */
export function getBlockchainConfig(): BlockchainConfig {
  return blockchainConfig;
}
