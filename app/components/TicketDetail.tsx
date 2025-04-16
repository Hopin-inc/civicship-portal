import { Ticket } from '../types/ticket';
import Image from 'next/image';
import { HandRaisedIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface TicketDetailProps {
  ticket: Ticket;
}

export default function TicketDetail({ ticket }: TicketDetailProps) {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
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
          <span className="text-gray-600">枚数</span>
          <span className="font-semibold">{ticket.quantity}枚</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">用途</span>
          <span className="font-semibold">{ticket.purpose}</span>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-8">
        <h2 className="flex items-center text-lg font-semibold mb-3">
          <HandRaisedIcon className="w-6 h-6 mr-2" />
          お願い
        </h2>
        <ul className="space-y-2">
          {ticket.requests.map((request, index) => (
            <li key={index} className="flex items-start">
              <span className="text-gray-700">{request}</span>
            </li>
          ))}
        </ul>
      </div>

      <button className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors">
        関わりを見つける
      </button>
    </div>
  );
} 