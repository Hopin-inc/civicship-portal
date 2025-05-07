import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface Ticket {
  id: string;
  senderName: string;
  senderImage: string;
  quantity: number;
  purpose: string;
  requests: string[];
}

const HandRaisedIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3.85c0 1.35-.65 2.6-1.725 3.4l-.05.05c-.2.2-.2.5 0 .7l.05.05c1.075.8 1.725 2.05 1.725 3.4v3.85a1.575 1.575 0 103.15 0v-3.85c0-1.35.65-2.6 1.725-3.4l.05-.05c.2-.2.2-.5 0-.7l-.05-.05c-1.075-.8-1.725-2.05-1.725-3.4v-3.85z" />
  </svg>
);

interface TicketDetailProps {
  ticket: Ticket;
}

export default function TicketDetail({ ticket }: TicketDetailProps) {
  return (
    <div className="max-w-md mx-auto bg-background rounded-xl shadow-md overflow-hidden p-6">
      <div className="text-center mb-6">
        <h1 className="text-xl font-semibold mb-2">
          {ticket.senderName}さんから
        </h1>
        <p className="text-lg">招待チケットが届きました</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="relative w-32 h-32 rounded-full overflow-hidden">
          <Image
            src={ticket.senderImage}
            alt={`${ticket.senderName}の写真`}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">枚数</span>
          <span className="font-semibold">{ticket.quantity}枚</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">用途</span>
          <span className="font-semibold">{ticket.purpose}</span>
        </div>
      </div>

      <div className="bg-primary-foreground p-4 rounded-lg mb-8">
        <h2 className="flex items-center text-lg font-semibold mb-3">
          <HandRaisedIcon className="w-6 h-6 mr-2" />
          お願い
        </h2>
        <ul className="space-y-2">
          {ticket.requests.map((request: string, index: number) => (
            <li key={index} className="flex items-start">
              <span className="text-gray-700">{request}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button 
        variant="primary"
        className="w-full py-3 px-4"
      >
        関わりを見つける
      </Button>
    </div>
  );
}                                                                                                                                                