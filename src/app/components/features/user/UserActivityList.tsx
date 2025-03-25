import { History, Plus } from "lucide-react";
import Image from "next/image";
import { EmptyState } from "@/components/shared/EmptyState";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

type Props = {
  userId: string;
  isOwner: boolean;
};

type ActivityItem = {
  id: string;
  type: 'participation' | 'article';
  title: string;
  date: string;
  location: string;
  category: string;
  participants?: { id: string; image: string }[];
  author?: { id: string; image: string };
  image: string;
};

// モックデータ
const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    type: 'participation',
    title: '解体屋さんから廃材を授かる会',
    date: '2023/05/15',
    location: '香川県高松市',
    category: 'EXPERIENCE',
    participants: [
      { id: '1', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1' },
      { id: '2', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2' },
      { id: '3', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3' },
    ],
    image: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    type: 'participation',
    title: '空き家庭園の緑化Day',
    date: '2023/04/15',
    location: '徳島県徳島市',
    category: 'QUEST',
    participants: [
      { id: '4', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4' },
      { id: '5', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user5' },
      { id: '6', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user6' },
    ],
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    type: 'article',
    title: '伝統を守り続ける職人の想い',
    date: '2023/04/15',
    location: '高知県高知市',
    category: 'ARTICLE',
    author: { id: '1', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=author1' },
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  }
];

const ActivityGrid = ({ activities }: { activities: ActivityItem[] }) => {
  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'EXPERIENCE':
        return { bg: '#FFE4E6', text: '#9F1239' };
      case 'QUEST':
        return { bg: '#FEF9C3', text: '#854D0E' };
      case 'EVENT':
        return { bg: '#DBEAFE', text: '#1E40AF' };
      case 'ARTICLE':
        return { bg: '#DCE7DD', text: '#166534' };
      default:
        return { bg: '#E5E7EB', text: '#374151' };
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'EXPERIENCE':
        return '体験';
      case 'QUEST':
        return 'クエスト';
      case 'EVENT':
        return 'イベント';
      case 'ARTICLE':
        return '記事';
      default:
        return category;
    }
  };

  const renderParticipants = (participants: { id: string; image: string }[]) => {
    const maxDisplay = 3;
    const remainingCount = participants.length - maxDisplay;
    const displayParticipants = participants.slice(0, maxDisplay);

    return (
      <div className="flex items-center">
        <div className="flex -space-x-2">
          {displayParticipants.map((participant, index) => (
            <div 
              key={participant.id} 
              className={`w-6 h-6 sm:w-8 sm:h-8 relative ${index === maxDisplay - 1 && remainingCount > 0 ? 'relative' : ''}`}
            >
              <Image
                src={participant.image}
                alt="Participant"
                fill
                className={`rounded-full border-2 border-white ${index === maxDisplay - 1 && remainingCount > 0 ? 'brightness-50' : ''}`}
              />
              {index === maxDisplay - 1 && remainingCount > 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-medium text-white">
                  +{remainingCount}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {activities.map((activity) => (
        <div key={activity.id} className="border rounded-lg overflow-hidden bg-card">
          <div className="relative h-32 sm:h-48">
            <Image
              src={activity.image}
              alt={activity.title}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-2 left-2">
              {activity.type === 'participation' && activity.participants ? (
                renderParticipants(activity.participants)
              ) : activity.author ? (
                <div className="w-6 h-6 sm:w-8 sm:h-8 relative">
                  <Image
                    src={activity.author.image}
                    alt="Author"
                    fill
                    className="rounded-full border-2 border-white"
                  />
                </div>
              ) : null}
            </div>
          </div>
          <div className="p-2 sm:p-4">
            <div 
              className="inline-block px-2 py-1 text-xs sm:text-sm rounded-full mb-1 sm:mb-2"
              style={{
                backgroundColor: getCategoryStyle(activity.category).bg,
                color: getCategoryStyle(activity.category).text,
              }}
            >
              {getCategoryLabel(activity.category)}
            </div>
            <h3 className="font-bold text-sm sm:text-base mb-1">{activity.title}</h3>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {activity.date} • {activity.location}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const FloatingActionButton = () => {
  return (
    <button
      className="fixed bottom-6 right-6 flex items-center gap-1 px-6 py-3 bg-[#4361EE] text-white rounded-full shadow-lg hover:bg-[#3651DE] transition-colors"
      onClick={() => {
        // TODO: Implement activity creation
        console.log("Create new activity");
      }}
    >
      <Plus className="w-5 h-5" />
      <span>活動を記録する</span>
    </button>
  );
};

export const UserActivityList = ({ userId, isOwner }: Props) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between py-4">
        <h2 className="text-lg font-semibold text-foreground">
          地域との関わり
        </h2>
      </div>
      {MOCK_ACTIVITIES.length > 0 ? (
        <ActivityGrid activities={MOCK_ACTIVITIES} />
      ) : (
        <EmptyState
          title="まだ活動履歴がありません"
          description={
            isOwner
              ? "地域の活動に参加して、タイムラインを作りましょう"
              : "地域の活動に参加すると、タイムラインが作成されます"
          }
          actionLabel="関わりを探す"
          onAction={() => {
            window.location.href = "/";
          }}
          hideActionButton={!isOwner}
          icon={<History className="w-8 h-8 text-muted-foreground font-thin" />}
        />
      )}
      {isOwner && <FloatingActionButton />}
    </section>
  );
};
