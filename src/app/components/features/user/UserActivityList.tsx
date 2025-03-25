import { History, Plus } from "lucide-react";
import Image from "next/image";
import { EmptyState } from "@/components/shared/EmptyState";

type Participation = {
  id: string;
  type: 'participation';
  title: string;
  date: string;
  location: string;
  category: '体験' | 'クエスト' | 'イベント';
  participants: { id: string; image: string }[];
  image: string;
};

type Article = {
  id: string;
  type: 'article';
  title: string;
  date: string;
  location: string;
  category: '記事';
  author: { id: string; image: string };
  image: string;
};

type ActivityItem = Participation | Article;

type Props = {
  activities: ActivityItem[];
  isOwner: boolean;
};

const ActivityGrid = ({ activities }: { activities: ActivityItem[] }) => {
  const getCategoryStyle = (category: string) => {
    switch (category) {
      case '体験':
        return { bg: '#FFE4E6', text: '#9F1239' };
      case 'クエスト':
        return { bg: '#FEF9C3', text: '#854D0E' };
      case 'イベント':
        return { bg: '#DBEAFE', text: '#1E40AF' };
      case '記事':
        return { bg: '#DCE7DD', text: '#166534' };
      default:
        return { bg: '#E5E7EB', text: '#374151' };
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
              {activity.type === 'participation' ? (
                renderParticipants(activity.participants)
              ) : (
                <div className="w-6 h-6 sm:w-8 sm:h-8 relative">
                  <Image
                    src={activity.author.image}
                    alt="Author"
                    fill
                    className="rounded-full border-2 border-white"
                  />
                </div>
              )}
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
              {activity.category}
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
      className="fixed bottom-6 right-6 flex items-center gap-1 px-6 py-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors"
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

export const UserActivityList = ({ activities, isOwner }: Props) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between py-4">
        <h2 className="text-lg font-semibold text-foreground">
          地域との関わり
        </h2>
      </div>
      {activities.length > 0 ? (
        <ActivityGrid activities={activities} />
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
