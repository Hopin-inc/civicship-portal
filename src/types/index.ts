export type CommunityId ={
  communityId: string;
}

export type Membership = {
  community?: {
    id: string;
    name?: string;
  };
  role?: string;
  status?: string;
}

export type CurrentUser = {
  id: string;
  name: string;
  memberships: Membership[];
}

export interface InfoCardProps {
  label: string;
  value?: string;
  showCopy?: boolean;
  copyData?: string;
  showExternalLink?: boolean;
  externalLink?: {
    url: string;
    text: string;
  };
  isWarning?: boolean;
  warningText?: string;
  secondaryValue?: string;
  secondaryLabel?: string;
  showTruncate?: boolean;
  truncatePattern?: 'middle' | 'end';
  truncateHead?: number;
  truncateTail?: number;
}
