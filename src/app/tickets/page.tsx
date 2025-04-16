'use client';

import { useQuery } from '@apollo/client';
import TicketList from '../components/features/ticket/TicketList';
import EmptyState from '../components/features/ticket/EmptyState';
import TicketDescription from '../components/features/ticket/TicketDescription';
import { Ticket } from '@/types/ticket';
import { GET_USER_WALLET } from '@/graphql/queries/user';
import { useAuth } from '@/contexts/AuthContext';

export default function TicketsPage() {
  const { user } = useAuth();
  const { data, loading, error } = useQuery(GET_USER_WALLET, {
    variables: { id: user?.id ?? '' },
    skip: !user?.id,
  });

  console.log('GET_USER_WALLET', data);

  const tickets: Ticket[] = data?.user?.wallets?.edges?.[0]?.node?.tickets?.edges?.map((edge: any) => ({
    id: edge?.node?.id,
    status: edge?.node?.status,
    utilityId: edge?.node?.utility?.id,
    hostName: edge?.node?.statusHistory?.edges?.[0]?.node?.createdByUser?.name || '不明',
    hostImage: edge?.node?.statusHistory?.edges?.[0]?.node?.createdByUser?.image || '/placeholder.png',
    quantity: 1,
    createdByUser: edge?.node?.statusHistory?.edges?.[0]?.node?.createdByUser,
  })) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-screen">
          <p className="text-red-500">エラーが発生しました</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 bg-white z-10">
        <div className="flex items-center h-14 px-4">
          <button className="p-2" onClick={() => window.history.back()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="flex-1 text-center text-xl font-bold">チケット</h1>
          <div className="w-10"></div>
        </div>
        <div className="h-[1px] bg-gray-200"></div>
      </header>

      <main className="pt-14 px-4">
        <div className="mb-6">
          <TicketDescription />
        </div>

        {tickets.length > 0 ? (
          <TicketList tickets={tickets} />
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
}
