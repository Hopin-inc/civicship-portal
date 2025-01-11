import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const ActivityDetail: React.FC = async () => {
  return (
    <main className="min-h-screen p-24">
      <Link href="/activities" className="inline-flex">
        <ChevronLeft />
        活動一覧に戻る
      </Link>
      <div className="w-full flex justify-between">
        <h1>活動詳細</h1>

      </div>
    </main>
  );
};

export default ActivityDetail;
