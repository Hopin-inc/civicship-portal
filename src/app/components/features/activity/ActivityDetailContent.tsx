import Image from "next/image";
import type { Activity } from "@/types";
import { Clock, Calendar, Users, MapPin } from "lucide-react";
import { mockCommunities } from "@/lib/data";
import { formatDuration } from "@/utils/date";
import { Button } from "@/components/ui/button";

type ActivityDetailContentProps = {
  activity: Activity;
  onReservationClick: (activity: Activity) => void;
};

export const ActivityDetailContent = ({
  activity,
  onReservationClick,
}: ActivityDetailContentProps) => {
  const community = mockCommunities.find((c) => c.id === activity.communityId);
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  const availableDays = activity.schedule.daysOfWeek.map((day) => days[day]);

  return (
    <div className="container mx-auto max-w-3xl py-6 space-y-8">
      {/* Description */}
      <div className="px-4 space-y-4">
        <h2 className="text-lg font-semibold text-muted-foreground pb-2">
          体験内容
        </h2>
        <p className="whitespace-pre-wrap">{activity.description}</p>
      </div>

      {/* Schedule */}
      <div className="px-4 space-y-4">
        <h2 className="text-lg font-semibold text-muted-foreground pb-2">
          開催スケジュール
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex gap-3 items-start">
            <Calendar className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <div className="text-muted-foreground">開催日</div>
              <div className="font-medium">{availableDays.join("・")}曜日</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <div className="text-muted-foreground">開催時間</div>
              <div className="font-medium">
                {activity.schedule.startTime} - {activity.schedule.endTime}
                <div className="text-sm">
                  （約{formatDuration(activity.duration)}）
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <div className="text-muted-foreground">定員</div>
              <div className="font-medium">{activity.capacity}名</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <div className="text-muted-foreground">開催場所</div>
              <div className="font-medium">{activity.location.name}</div>
              <div className="text-sm text-muted-foreground">
                {activity.location.prefecture} {activity.location.city}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Schedule */}
      <div className="px-4 space-y-4">
        <h2 className="text-lg font-semibold text-muted-foreground pb-2">
          当日の流れ
        </h2>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <tbody>
              {activity.timeSchedule.map((schedule, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-muted/50" : "bg-background"}
                >
                  <td className="py-3 px-4 border-b text-sm font-medium whitespace-nowrap">
                    {schedule.time}
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-muted-foreground">
                    {schedule.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Precautions */}
      <div className="px-4 space-y-4">
        <h2 className="text-lg font-semibold text-muted-foreground pb-2">
          注意事項
        </h2>
        <ul className="list-disc list-inside space-y-2">
          {activity.precautions.map((precaution, index) => (
            <li key={index} className="">
              {precaution}
            </li>
          ))}
        </ul>
      </div>

      {/* Host */}
      <div className="px-4 space-y-4">
        <h2 className="text-lg font-semibold text-muted-foreground pb-2">
          案内人
        </h2>
        <div className="flex items-start gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden">
            <Image
              src={activity.host.image}
              alt={activity.host.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="">{activity.host.name}</div>
            <p className="mt-1 text-sm text-muted-foreground">
              {activity.host.bio}
            </p>
          </div>
        </div>
      </div>

      {/* Community */}
      {community && (
        <div className="px-4 space-y-4">
          <h2 className="text-lg font-bold">主催コミュニティ</h2>
          <div className="flex items-start gap-4">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden">
              <Image
                src={community.icon ?? "/placeholder.svg"}
                alt={community.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="font-bold">{community.title}</div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {community.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add padding to prevent content from being hidden under the fixed button */}
      <div className="h-[120px]" />

      {/* Reservation Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="container mx-auto max-w-3xl px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-1">
              <div className="text-xl font-semibold">
                ¥{activity.price.toLocaleString()}
                <span className="text-sm text-muted-foreground tracking-wider ml-1">
                  /人
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{activity.location.name}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Button
                className="bg-[#0052CC] hover:bg-[#0052CC]/90 text-white font-normal h-12 rounded-lg text-base w-[120px]"
                onClick={() => onReservationClick(activity)}
              >
                予約する
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
