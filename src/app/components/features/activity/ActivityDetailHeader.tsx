import Image from "next/image";
import type { Activity } from "@/types";
import { formatDuration } from "@/utils/date";
import { Clock, MapPin } from "lucide-react";

type Props = {
  activity: Activity;
};

export const ActivityDetailHeader = ({ activity }: Props) => {
  return (
    <div className="relative">
      <div className="relative aspect-video sm:aspect-[3/1]">
        <Image
          src={activity.images[0]}
          alt={activity.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="container mx-auto max-w-3xl">
        <div className="px-4 -mt-4 relative z-10">
          <div className="bg-background rounded-xl p-4 shadow-sm space-y-2">
            <div className="text-sm text-muted-foreground">
              {activity.location.prefecture} {activity.location.city}
            </div>
            <h1 className="text-xl font-bold">{activity.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(activity.duration)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{activity.location.name}</span>
              </div>
            </div>
            <div className="text-lg font-bold">
              ¥{activity.price.toLocaleString()}/人
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
