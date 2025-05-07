import Image from "next/image";
import Link from "next/link";
import { Coins, Gift, HelpCircle } from "lucide-react";
import { CardWrapper } from "@/components/ui/card-wrapper";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Community, Opportunity } from "@/types";

type Props = {
  opportunity: Opportunity;
  community: Community | null;
  userPoints: number;
  hasEnoughPoints: boolean;
  onParticipantsClick: () => void;
};

export const OpportunityDetailContent = ({
  opportunity,
  community,
  userPoints,
  hasEnoughPoints,
  onParticipantsClick,
}: Props) => {
  const isEvent = opportunity?.type === "EVENT";
  const isFull =
    opportunity?.participants && opportunity?.capacity
      ? opportunity.participants.length >= opportunity?.capacity
      : false;

  return (
    <div className="container max-w-2xl mx-auto px-8 space-y-8">
      <div className="space-y-8">
        {/* Description */}
        <div className="mb-8">
          <h2 className="text-muted-foreground text-lg font-semibold mb-4">
            詳細
          </h2>
          <div className="prose prose-sm max-w-none">
            {opportunity.description.split("\n").map((line, i) => (
              <p key={i} className="mb-4">
                {line}
              </p>
            ))}
          </div>
          {/* Points information */}
          <div className="flex flex-col gap-3">
            {(opportunity?.pointsForJoin ?? 0) > 0 && (
              <div className="flex items-center gap-3 text-sm border border-gray-200 rounded-lg p-4 bg-[#fcfaf7] mt-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-[#f3f0e9] flex items-center justify-center border border-gray-100">
                  <Coins className="w-5 h-5 text-gray-700" />
                </div>
                <div className="flex-1">
                  <span className="text-gray-700">
                    この活動に参加するには
                    <span className="font-bold mx-1 text-[#4b5563]">
                      {opportunity.pointsForJoin}ポイント
                    </span>
                    が必要です
                  </span>
                  {!hasEnoughPoints && (
                    <div className="flex items-center gap-1 mt-2 text-red-700 text-xs bg-red-50 p-2 rounded">
                      <span>
                        ポイントが不足しています（現在の保有ポイント:{" "}
                        {userPoints}ポイント）
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
            {(opportunity?.pointsForComplete ?? 0) > 0 && (
              <div className="flex items-center gap-3 text-sm border border-gray-200 rounded-lg p-4 bg-[#fcfaf7] mt-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-[#f3f0e9] flex items-center justify-center border border-gray-100">
                  <Gift className="w-5 h-5 text-gray-700" />
                </div>
                <div className="flex-1">
                  <span className="text-gray-700">
                    活動完了時に
                    <span className="font-bold mx-1 text-[#4b5563]">
                      {opportunity.pointsForComplete}ポイント
                    </span>
                    を獲得できます
                  </span>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="link">
                      <HelpCircle className="h-4 w-4 text-gray-500 hover:text-gray-700 transition-colors" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-[#fcfaf7] border-gray-200">
                    <div className="space-y-3 p-1">
                      <h4 className="font-medium text-gray-800 border-b border-gray-200 pb-2 text-sm">
                        ポイントについて
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        活動で獲得したポイントは、地域の特産品や体験との交換にご利用いただけます。
                        <br />※
                        コミュニティで獲得したポイントは、そのコミュニティ内でのみ有効です
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </div>

        {/* Recommended For */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-muted-foreground mb-4">
            こんな方におすすめ
          </h2>
          <ul className="space-y-2">
            {(opportunity.recommendedFor ?? []).map((item, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="mt-1">
                  <svg
                    className="h-4 w-4 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-base">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Speaker/Host Info */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-muted-foreground mb-4">
            {isEvent ? "スピーカーの紹介" : "ホストの紹介"}
          </h2>
          <div className="flex items-start space-x-4">
            <div className="relative h-16 w-16 rounded-full overflow-hidden">
              <Image
                src={opportunity.host.image || "/placeholder.svg"}
                alt={opportunity.host.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{opportunity.host.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {opportunity.host.title}
              </p>
              <p className="text-sm">{opportunity.host.bio}</p>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {opportunity.relatedArticles &&
          opportunity.relatedArticles.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-muted-foreground mb-4">
                関連記事
              </h2>
              <div className="grid gap-4">
                {opportunity.relatedArticles.map((article) => (
                  <Link
                    key={article.url}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="flex items-start gap-4 p-4 rounded-xl border bg-card hover:bg-muted/10 transition-all duration-200">
                      <div className="relative h-24 w-24 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={article.image || "/placeholder.svg"}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            {article.type === "interview"
                              ? "INTERVIEW"
                              : "ARTICLE"}
                          </span>
                        </div>
                        <h3 className="font-medium mb-1 group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        {article.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {article.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        {/* Community Info */}
        {community && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-muted-foreground mb-4">
              主催コミュニティ
            </h2>
            <Link href={`/communities/${community.id}`} className="block group">
              <CardWrapper className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden">
                    <Image
                      src={community.icon || "/placeholder.svg"}
                      alt={community.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium group-hover:text-primary">
                        {community.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {community.description}
                    </p>
                  </div>
                </div>
              </CardWrapper>
            </Link>
          </div>
        )}

        {/* Participants */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold mb-4 text-muted-foreground pb-2">
            参加者一覧
          </h2>
          <CardWrapper className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold">
                  {opportunity?.participants?.length || 0}
                </span>
                <span className="text-xs text-muted-foreground">
                  / {opportunity?.capacity || 0} 名
                </span>
              </div>
              {isFull && (
                <span className="text-sm text-red-500 bg-red-50 px-3 py-1 rounded-full">
                  満員
                </span>
              )}
            </div>

            {opportunity.participants?.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">✨</div>
                <p className="text-lg font-medium mb-2">
                  {isEvent
                    ? "イベントを一緒に盛り上げましょう！"
                    : "新しい仲間と一緒にチャレンジしましょう！"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isEvent
                    ? "あなたの参加で、より素敵なイベントになります"
                    : "あなたの活動で、プロジェクトがより良くなります"}
                </p>
              </div>
            ) : (
              opportunity.participants?.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Button
                      onClick={onParticipantsClick}
                      variant="link"
                    >
                      <div className="flex">
                        {opportunity.participants
                          .slice(0, 2)
                          .map((participant, index) => (
                            <div
                              key={participant.id}
                              className="relative w-8 h-8 rounded-full border-2 border-background overflow-hidden hover:scale-110 transition-transform"
                              style={{
                                marginLeft: index === 0 ? 0 : "-8px",
                                zIndex: index,
                              }}
                            >
                              <Image
                                src={participant.image || "/placeholder.svg"}
                                alt={participant.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        {opportunity.participants.length > 2 && (
                          <div
                            className="relative w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium hover:scale-110 transition-transform"
                            style={{ marginLeft: "-8px", zIndex: 2 }}
                          >
                            +{opportunity.participants.length - 2}
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {opportunity.participants.slice(0, 2).map((p, i) => (
                          <span key={p.id}>
                            {p.name}
                            {i <
                            Math.min(1, opportunity.participants.length - 1)
                              ? "、"
                              : ""}
                          </span>
                        ))}
                        {opportunity.participants.length > 2 && (
                          <span>ほか</span>
                        )}
                      </div>
                    </Button>
                  </div>
                </div>
              )
            )}
          </CardWrapper>
        </div>
      </div>
    </div>
  );
};
