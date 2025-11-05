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
    network: BlockchainNetwork;
    explorerBaseUrl: string;
  };
}

/**
 * Get blockchain configuration from environment variables
 * Defaults to mainnet for both chains
 */
export function getBlockchainConfig(): BlockchainConfig {
  const cardanoNetwork = (process.env.NEXT_PUBLIC_CARDANO_NETWORK || 'mainnet') as BlockchainNetwork;
  const ethereumNetwork = (process.env.NEXT_PUBLIC_ETHEREUM_NETWORK || 'mainnet') as BlockchainNetwork;

  return {
    cardano: {
      network: cardanoNetwork,
      explorerBaseUrl: cardanoNetwork === 'mainnet'
        ? 'https://cardanoscan.io'
        : 'https://preprod.cardanoscan.io',
    },
    ethereum: {
      network: ethereumNetwork,
      explorerBaseUrl: ethereumNetwork === 'mainnet'
        ? 'https://etherscan.io'
        : 'https://sepolia.etherscan.io',
    },
  };
}
