/**
 * Blockchain network configuration
 */

export type BlockchainNetwork = 'mainnet' | 'testnet';

export interface BlockchainConfig {
  cardano: {
    network: BlockchainNetwork;
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
 * Cardano: Uses mainnet by default
 * Ethereum: All ERC-721 NFTs use Base Sepolia (Blockscout)
 */
export function getBlockchainConfig(): BlockchainConfig {
  const cardanoNetwork = (process.env.NEXT_PUBLIC_CARDANO_NETWORK || 'mainnet') as BlockchainNetwork;

  return {
    cardano: {
      network: cardanoNetwork,
      explorerBaseUrl: cardanoNetwork === 'mainnet'
        ? 'https://cardanoscan.io'
        : 'https://preprod.cardanoscan.io',
    },
    ethereum: {
      explorerBaseUrl: 'https://base-sepolia.blockscout.com',
      contractPath: '/token/{address}',
      tokenPath: '/token/{address}/instance/{tokenId}',
    },
  };
}
