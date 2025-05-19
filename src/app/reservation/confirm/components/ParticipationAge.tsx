import { Input } from "@/components/ui/input";

export const ParticipationAge: React.FC = () => {
  return (
    <div className="px-6 py-6">
      <h2 className="text-display-sm mb-1">参加者の年齢</h2>
      <p className="text-body-sm text-caption mb-4">
        案内人の事前準備が変わる場合があるため、記入にご協力ください
      </p>
      <Input placeholder="1歳、3歳、51歳" />
    </div>
  );
};
