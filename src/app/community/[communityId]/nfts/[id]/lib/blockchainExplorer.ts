/**
 * Blockchain explorer utilities for NFT verification
 */

import { blockchainConfig } from "./blockchainConfig";

export type Chain = "cardano" | "ethereum";

export interface ExplorerUrlParams {
  chain: Chain;
  contractOrPolicyAddress: string;
  instanceId: string;
  tokenId?: string;
  assetNameHex?: string;
  metadata?: unknown;
}

/**
 * Detect blockchain chain from NFT token type
 */
export function detectChain(tokenType?: string): Chain | null {
  if (!tokenType) return null;

  const normalizedType = tokenType.toUpperCase();

  if (/\bCIP-?25\b/.test(normalizedType)) {
    return "cardano";
  }

  if (/\bERC-?721\b/.test(normalizedType)) {
    return "ethereum";
  }

  return null;
}

/**
 * Detect chain from contract/policy address format
 * Fallback method when token type is not available
 */
export function detectChainFromAddress(address?: string): Chain | null {
  if (!address) return null;

  if (address.startsWith("0x") && address.length === 42) {
    return "ethereum";
  }

  if (/^[0-9a-fA-F]{56}$/.test(address)) {
    return "cardano";
  }

  return null;
}

/**
 * Get blockchain explorer URL for NFT
 */
export function getExplorerUrl(params: ExplorerUrlParams): string {
  const config = blockchainConfig;
  const { chain, contractOrPolicyAddress, assetNameHex, instanceId } = params;

  switch (chain) {
    case "cardano": {
      const baseUrl = config.cardano.explorerBaseUrl;

      if (assetNameHex) {
        return `${baseUrl}/token/${contractOrPolicyAddress}.${assetNameHex}`;
      }

      return `${baseUrl}/policy/${contractOrPolicyAddress}`;
    }
    case "ethereum": {
      const { explorerBaseUrl } = config.ethereum;

      if (instanceId) {
        return `${explorerBaseUrl}/token/${contractOrPolicyAddress}/instance/${instanceId}`;
      }

      return `${explorerBaseUrl}/token/${contractOrPolicyAddress}`;
    }
    default: {
      throw new Error(`Unsupported chain: ${chain}`);
    }
  }
}

/**
 * Get human-readable chain name
 */
export function getChainDisplayName(chain: Chain): string {
  return chain === "cardano" ? "Cardano" : "Ethereum";
}
