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

/**
 * Convert string to hex encoding
 */
function stringToHex(str: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Check if a string is already in hex format
 */
function isHexString(str: string): boolean {
  return /^[0-9a-fA-F]+$/.test(str) && str.length % 2 === 0;
}

/**
 * Extract asset name hex from Cardano metadata
 * Looks for the asset name in the CIP-25 metadata structure
 *
 * Note: This implementation assumes a single policy ID and single asset name
 * within the CIP-25 metadata. If multiple policies or assets exist, only the
 * first one will be extracted.
 */
export function extractCardanoAssetNameHex(metadata: unknown): string | undefined {
  if (typeof metadata !== "object" || metadata === null) return undefined;

  const meta = metadata as Record<string, unknown>;
  const cip25 = meta["721"];

  if (typeof cip25 !== "object" || cip25 === null) return undefined;

  const cip25Obj = cip25 as Record<string, unknown>;

  const policyId = Object.keys(cip25Obj).find(
    (key) => key !== "version" && typeof cip25Obj[key] === "object" && cip25Obj[key] !== null,
  );

  if (!policyId) return undefined;

  const policyData = cip25Obj[policyId];
  if (typeof policyData !== "object" || policyData === null) return undefined;

  const assetNames = Object.keys(policyData);
  if (assetNames.length === 0) return undefined;

  const assetName = assetNames[0];

  return isHexString(assetName) ? assetName : stringToHex(assetName);
}
