import Link from "next/link";
import { ChevronLeft, Clock, MapPin, CalendarDays, AlertCircle, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Activity } from "@/types";
import { mockActivities } from "@/lib/data";
import { Button } from "@/components/ui/button";

// 関連アクティビティのモックデータ
const relatedActivities = mockActivities.slice(0, 5);

// モックの予約可能日程データ
const availableDates = [
  {
    date: "7月25日",
    day: "月",
    time: "13:30〜15:30",
    participants: 5,
    price: 2000
  },
  {
    date: "7月26日",
    day: "火",
    time: "13:30〜15:30",
    participants: 3,
    price: 2000
  },
  {
    date: "7月26日",
    day: "火",
    time: "13:30〜15:30",
    participants: 3,
    price: 2000
  },
  {
    date: "7月26日",
    day: "火",
    time: "13:30〜15:30",
    participants: 3,
    price: 2000
  },
  {
    date: "7月26日",
    day: "火",
    time: "13:30〜15:30",
    participants: 3,
    price: 2000
  },
  // 必要に応じて追加の日程をここに追加
];

const ActivityCard: React.FC<{ activity: Activity }> = ({ activity }) => (
  <div className="flex-none w-72 bg-white rounded-xl shadow-sm overflow-hidden">
    <div className="relative h-40">
      <Image
        src={activity.images[0]}
        alt={activity.title}
        fill
        className="object-cover"
      />
    </div>
    <div className="p-4">
      <h3 className="font-bold text-lg mb-2 line-clamp-2">{activity.title}</h3>
      <div className="flex items-center gap-2 text-gray-600">
        <MapPin className="h-4 w-4" />
        <span className="text-sm">{activity.location.name}</span>
      </div>
    </div>
  </div>
);

const ScheduleCard: React.FC<{
  date: string;
  day: string;
  time: string;
  participants: number;
  price: number;
}> = ({ date, day, time, participants, price }) => (
  <div className="bg-white rounded-xl border p-6 w-full max-w-[360px]">
    <div className="mb-4">
      <h3 className="text-2xl font-bold mb-2">{date}（{day}）</h3>
      <p className="text-lg">{time}</p>
    </div>
    <div className="mb-4">
      <p className="text-gray-600">参加予定人数 {participants}人</p>
    </div>
    <div className="flex items-center justify-between">
      <p className="text-xl font-bold">{price.toLocaleString()}円/人〜</p>
      <Button
        variant="default"
        size="lg"
        className="rounded-full"
      >
        選択
      </Button>
    </div>
  </div>
);

const ActivityDetail: React.FC = async () => {
  // 陶芸体験のデータを使用
  const activity = mockActivities[3]; // 阿波藍染め体験のデータ

  return (
    <>
      <main className="min-h-screen pb-24">
        <div className="max-w-7xl mx-auto px-4">

          {/* メインビジュアル */}
          <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-8">
            <Image
              src={activity.images[0]}
              alt={activity.title}
              fill
              className="object-cover"
            />
          </div>

          {/* タイトルと基本情報 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{activity.title}</h1>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <span>{activity.location.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span>{activity.duration}分</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-gray-500" />
                <span>
                  {activity.schedule.daysOfWeek.includes(1) && "月"}
                  {activity.schedule.daysOfWeek.includes(2) && "火"}
                  {activity.schedule.daysOfWeek.includes(3) && "水"}
                  {activity.schedule.daysOfWeek.includes(4) && "木"}
                  {activity.schedule.daysOfWeek.includes(5) && "金"}
                  {activity.schedule.daysOfWeek.includes(6) && "土"}
                  {activity.schedule.daysOfWeek.includes(0) && "日"}
                  開催
                </span>
              </div>
            </div>
          </div>

          {/* 体験内容 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">体験できること</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{activity.description}</p>
          </section>

          {/* 案内者情報 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">案内者</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-start gap-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={activity.host.image}
                    alt={activity.host.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">{activity.host.name}</h3>
                  <p className="text-gray-600">{activity.host.bio}</p>
                </div>
              </div>
            </div>
          </section>

          {/* 最近の関わり */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">最近の関わり</h2>
              <Link href="#" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                もっと見る
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
              {relatedActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          </section>

          {/* 集合場所 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">集合場所</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="mb-4">{activity.location.address}</p>
              <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(activity.location.address)}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </section>

          {/* 開催日 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">開催日</h2>
            <p className="text-gray-600 mb-4">申込可能な時間枠の数：288</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center">
              {availableDates.map((schedule, index) => (
                <ScheduleCard
                  key={index}
                  date={schedule.date}
                  day={schedule.day}
                  time={schedule.time}
                  participants={schedule.participants}
                  price={schedule.price}
                />
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">注意事項</h2>
            <ul className="space-y-4">
              {activity.precautions.map((precaution, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-gray-500 flex-shrink-0 mt-1" />
                  <span>{precaution}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">似ている体験</h2>
              <Link href="#" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                もっと見る
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
              {relatedActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* 固定フッター */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">1人あたり</p>
            <p className="text-2xl font-bold">¥{activity.price.toLocaleString()}</p>
          </div>
          <Link href={`/reservation/select-date?activity_id=${activity.id}`}>
            <Button
              variant="default"
              size="lg"
              className="rounded-lg"
            >
              予約する
            </Button>
          </Link>
        </div>
      </footer>
    </>
  );
};

export default ActivityDetail;
