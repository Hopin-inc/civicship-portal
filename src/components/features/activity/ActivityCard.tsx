import { Activity } from "@/types";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { formatDuration } from "@/utils/date";

type Props = {
  activity: Activity;
  className?: string;
};

export function ActivityCard({ activity, className }: Props) {
  return (
    <Link href={`/activities/${activity.id}`} className={className}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-[4/3]">
          <Image
            src={activity.images[0]}
            alt={activity.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4 space-y-2">
          <div className="text-sm text-muted-foreground">
            {activity.location.prefecture} {activity.location.city}
          </div>
          <h3 className="font-bold line-clamp-2">{activity.title}</h3>
          <div className="flex items-center justify-between text-sm">
            <div className="text-muted-foreground">
              {formatDuration(activity.duration)}
            </div>
            <div className="font-bold">¥{activity.price.toLocaleString()}</div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
