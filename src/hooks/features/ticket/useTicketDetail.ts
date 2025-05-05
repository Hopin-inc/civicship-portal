'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface TicketDetail {
  id: string;
  hostName: string;
  ticketCount: number;
  purpose: string;
  requests: string[];
  hostImage?: string;
  eventName?: string;
  eventUrl?: string;
}

/**
 * Custom hook for fetching and managing ticket details
 */
export const useTicketDetail = (ticketId: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ticketDetail, setTicketDetail] = useState<TicketDetail | null>(null);

  useEffect(() => {
    const fetchTicketDetail = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const mockTicketData: TicketDetail = {
          id: ticketId,
          hostName: "田中 花子",
          ticketCount: 2,
          purpose: "田中花子さんが主催する\n体験に無料参加できる",
          requests: [
            "だれが誘ってくれると嬉しい。",
            "当日の様子を写真に撮って、投稿しよう。関わりを残せるよ。"
          ],
          hostImage: "/placeholder-profile.jpg",
          eventName: "NEO88祭",
          eventUrl: "https://app.kyosodao.io/"
        };
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setTicketDetail(mockTicketData);
      } catch (err) {
        console.error('Error fetching ticket detail:', err);
        setError('チケット情報の取得に失敗しました。');
        toast.error('チケット情報の取得に失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTicketDetail();
  }, [ticketId]);

  const findRelatedOpportunities = async () => {
    toast.success('関連する体験を探しています...');
  };

  return {
    isLoading,
    error,
    ticketDetail,
    findRelatedOpportunities
  };
};

export default useTicketDetail;
