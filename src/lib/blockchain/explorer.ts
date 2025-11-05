/**
 * Blockchain explorer utilities for NFT verification
 */

import { getBlockchainConfig } from './config';

export type Chain = 'cardano' | 'ethereum';

export interface ExplorerUrlParams {
  chain: Chain;
  contractOrPolicyAddress: string;
  tokenId?: string;
  assetNameHex?: string;
}

export interface TransactionUrlParams {
  chain: Chain;
  txHash: string;
}

/**
 * Detect blockchain chain from NFT token type
 */
export function detectChain(tokenType?: string): Chain | null {
  if (!tokenType) return null;
  
  const normalizedType = tokenType.toUpperCase();
  
  if (normalizedType.includes('CIP-25') || normalizedType.includes('CIP25')) {
    return 'cardano';
  }
  
  if (normalizedType.includes('ERC-721') || normalizedType.includes('ERC721')) {
    return 'ethereum';
  }
  
  return null;
}

/**
 * Detect chain from contract/policy address format
 * Fallback method when token type is not available
 */
export function detectChainFromAddress(address?: string): Chain | null {
  if (!address) return null;
  
  if (address.startsWith('0x') && address.length === 42) {
    return 'ethereum';
  }
  
  if (/^[0-9a-fA-F]{56}$/.test(address)) {
    return 'cardano';
  }
  
  return null;
}

/**
 * Get blockchain explorer URL for NFT
 */
export function getExplorerUrl(params: ExplorerUrlParams): string {
  const config = getBlockchainConfig();
  const { chain, contractOrPolicyAddress, tokenId, assetNameHex } = params;
  
  if (chain === 'cardano') {
    const baseUrl = config.cardano.explorerBaseUrl;
    
    if (assetNameHex) {
      return `${baseUrl}/token/${contractOrPolicyAddress}.${assetNameHex}`;
    }
    
    return `${baseUrl}/policy/${contractOrPolicyAddress}`;
  }
  
  if (chain === 'ethereum') {
    const baseUrl = config.ethereum.explorerBaseUrl;
    
    if (tokenId) {
      return `${baseUrl}/nft/${contractOrPolicyAddress}/${tokenId}`;
    }
    
    return `${baseUrl}/address/${contractOrPolicyAddress}`;
  }
  
  throw new Error(`Unsupported chain: ${chain}`);
}

/**
 * Get blockchain explorer URL for transaction
 */
export function getTransactionUrl(params: TransactionUrlParams): string {
  const config = getBlockchainConfig();
  const { chain, txHash } = params;
  
  if (chain === 'cardano') {
    return `${config.cardano.explorerBaseUrl}/transaction/${txHash}`;
  }
  
  if (chain === 'ethereum') {
    return `${config.ethereum.explorerBaseUrl}/tx/${txHash}`;
  }
  
  throw new Error(`Unsupported chain: ${chain}`);
}

/**
 * Get human-readable chain name
 */
export function getChainDisplayName(chain: Chain): string {
  return chain === 'cardano' ? 'Cardano' : 'Ethereum';
}

/**
 * Convert string to hex encoding
 */
function stringToHex(str: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  return Array.from(bytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Check if a string is already in hex format
 */
function isHexString(str: string): boolean {
  return /^[0-9a-fA-F]+$/.test(str);
}

/**
 * Extract asset name hex from Cardano metadata
 * Looks for the asset name in the CIP-25 metadata structure
 */
export function extractCardanoAssetNameHex(metadata: unknown): string | undefined {
  if (!metadata || typeof metadata !== 'object') return undefined;
  
  try {
    const meta = metadata as Record<string, unknown>;
    const cip25 = meta['721'];
    
    if (!cip25 || typeof cip25 !== 'object') return undefined;
    
    const cip25Obj = cip25 as Record<string, unknown>;
    
    const policyId = Object.keys(cip25Obj).find(
      key => key !== 'version' && typeof cip25Obj[key] === 'object' && cip25Obj[key] !== null
    );
    
    if (!policyId) return undefined;
    
    const policyData = cip25Obj[policyId];
    if (!policyData || typeof policyData !== 'object') return undefined;
    
    const assetNames = Object.keys(policyData as Record<string, unknown>);
    if (assetNames.length === 0) return undefined;
    
    const assetName = assetNames[0];
    
    return isHexString(assetName) ? assetName : stringToHex(assetName);
  } catch {
    return undefined;
  }
}
