import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Ticket as TicketIcon } from 'lucide-react';
import { Ticket } from '@/types/ticket';

interface TicketListProps {
  tickets: Ticket[];
}

export default function TicketList({ tickets }: TicketListProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="検索ワードを入力"
          className="w-full px-4 py-3 pl-10 border rounded-lg"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
      </div>

      {tickets.map((ticket) => (
        <div key={ticket.id} className="bg-white rounded-[20px] p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={ticket.hostImage ?? "/images/tickets/empty-1.jpg"}
                  alt={ticket.hostName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-2">
                <TicketIcon className="w-5 h-5 text-[#4361EE]" />
                <span className="text-[#4361EE] font-medium">{ticket.quantity}枚</span>
              </div>
            </div>
            <Button
              variant="outline"
              className="h-12 px-8 rounded-full text-[#4361EE] border-[#4361EE] hover:bg-blue-50"
            >
              関わりを見つける
            </Button>
          </div>
          <p className="mt-4 text-gray-900">
            {ticket.hostName}さんからの招待
          </p>
        </div>
      ))}
    </div>
  );
} 