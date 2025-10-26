export interface WalletViewModel {
  walletId: string;
  points: number;
  accumulatedPoints?: number;
  ticketsAvailable?: number;
  walletType: 'MEMBER' | 'COMMUNITY';
  ownerName?: string;
}

export interface TransactionViewModel {
  id: string;
  reason: string;
  description?: string;
  comment?: string;
  transferPoints: number;
  transferredAt: string;
  didValue?: string;
  avatarUrl?: string;
  isOutgoing: boolean;
}
