import { Card, CardHeader } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface DidDisplayCardProps {
  label: string;
  name?: string | null;
  did?: string | null;
  truncateDid: (did: string | undefined | null, length?: number) => string;
}

export const DidDisplayCard: React.FC<DidDisplayCardProps> = ({ label, name, did, truncateDid }) => (
  <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none ">
    <CardHeader className="flex flex-row items-center justify-between p-6">
      <div className="text-gray-400 text-xs font-bold">{label}</div>
      <div className="flex flex-col items-end">
        <div className="text-sm font-bold text-black">{name}</div>
        {did ? (
          <div className="flex items-center text-gray-400 text-sm mt-1">
            <Copy
              className="w-4 h-4 mr-1"
              onClick={() => {
                navigator.clipboard.writeText(did ?? "");
                toast.success("コピーしました");
              }}
            />
            <span>{truncateDid(did ?? "", 15)}</span>
          </div>
        ) : (
          <div className="text-gray-400 text-sm mt-1">did発行中</div>
        )}
      </div>
    </CardHeader>
  </Card>
); 