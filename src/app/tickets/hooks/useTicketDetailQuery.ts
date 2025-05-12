'use client';

import { useState, useEffect } from 'react';

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
 * Hook for fetching ticket detail data
 * Responsible only for data fetching, not UI control or transformation
 */
export const useTicketDetailQuery = (ticketId: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TicketDetail | null>(null);

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
        
        setData(mockTicketData);
      } catch (err) {
        console.error('Error fetching ticket detail:', err);
        setError('チケット情報の取得に失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTicketDetail();
  }, [ticketId]);

  return {
    data,
    isLoading,
    error
  };
};
