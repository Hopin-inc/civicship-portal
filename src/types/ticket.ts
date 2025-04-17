export interface Ticket {
  id: string;
  hostName: string;
  hostImage: string;
  quantity: number;
  status: 'AVAILABLE' | 'USED' | 'EXPIRED';
  utilityId?: string;
  createdByUser?: {
    id: string;
    name: string;
    image: string | null;
  };
} 