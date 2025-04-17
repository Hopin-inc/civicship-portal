import { Info } from "lucide-react";

export default function TicketDescription() {
  return (
    <div className="bg-gray-50 rounded-[20px] p-4">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-gray-500 mt-0.5" />
        <div>
          <h2 className="text-base font-bold mb-1">チケットとは</h2>
          <p className="text-gray-600 leading-relaxed">
            チケットを送ってくれた人が主催する体験に<br />
            無料で参加することができます。
          </p>
        </div>
      </div>
    </div>
  );
} 