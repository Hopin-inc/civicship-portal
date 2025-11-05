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
  metadata?: unknown;
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
 * Extract tokenId from ERC-721 metadata
 */
export function extractEthereumTokenId(metadata: unknown): string | undefined {
  if (!metadata || typeof metadata !== 'object') {
    return undefined;
  }
  
  try {
    const meta = metadata as Record<string, unknown>;
    
    if (meta.external_url && typeof meta.external_url === 'string') {
      const match = meta.external_url.match(/\/tokens?\/[^/]+\/(\d+)$/i);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    if (meta.name && typeof meta.name === 'string') {
      const match = meta.name.match(/#\s*(\d+)$/);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return undefined;
  } catch {
    return undefined;
  }
}

/**
 * Get blockchain explorer URL for NFT
 */
export function getExplorerUrl(params: ExplorerUrlParams): string {
  const config = getBlockchainConfig();
  const { chain, contractOrPolicyAddress, tokenId, assetNameHex, metadata } = params;
  
  if (chain === 'cardano') {
    const baseUrl = config.cardano.explorerBaseUrl;
    
    if (assetNameHex) {
      return `${baseUrl}/token/${contractOrPolicyAddress}.${assetNameHex}`;
    }
    
    return `${baseUrl}/policy/${contractOrPolicyAddress}`;
  }
  
  if (chain === 'ethereum') {
    const { explorerBaseUrl, contractPath, tokenPath } = config.ethereum;
    
    const extractedTokenId = tokenId || extractEthereumTokenId(metadata);
    
    if (extractedTokenId) {
      const url = tokenPath
        .replace('{address}', contractOrPolicyAddress)
        .replace('{tokenId}', extractedTokenId);
      return `${explorerBaseUrl}${url}`;
    }
    
    const url = contractPath.replace('{address}', contractOrPolicyAddress);
    return `${explorerBaseUrl}${url}`;
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
