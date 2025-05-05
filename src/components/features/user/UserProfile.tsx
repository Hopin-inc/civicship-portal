import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserSocialLinks } from "@/components/features/user/UserSocialLinks";
import MapPinIcon from "../../../../public/icons/map-pin.svg";
import { cn } from "@/lib/utils";

interface UserProfileProps {
  user: {
    id: string;
    name: string;
    image: string | null;
    bio: string | null;
    currentPrefecture: string | null;
    socialLinks: Array<{
      type: string;
      url: string | null;
    }>;
  };
  isOwner: boolean;
  onUpdateSocialLinks?: (socialLinks: Array<{ type: string; url: string }>) => void;
}

const BIO_TRUNCATE_LENGTH = 100;

export function UserProfile({ user, isOwner, onUpdateSocialLinks }: UserProfileProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const truncateBio = (bio: string | null) => {
    if (!bio) return "";
    return isExpanded ? bio : bio.slice(0, BIO_TRUNCATE_LENGTH);
  };

  const shouldShowMore = (bio: string | null) => {
    return bio ? bio.length > BIO_TRUNCATE_LENGTH : false;
  };

  return (
    <div className="space-y-6">
      <div className="relative flex">
        <div className="w-20 h-20 relative">
          <Image
            src={user.image || "/placeholder.svg"}
            alt={user.name}
            fill
            className="rounded-full object-cover"
          />
        </div>
        {isOwner && (
          <Button
            variant="secondary"
            className="border-[#4361EE] text-[#4361EE] absolute right-0 top-[50%] -translate-y-1/2"
            asChild
          >
            <Link href="/users/me/edit">
              編集
            </Link>
          </Button>
        )}
      </div>

      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">
            {user.name}
          </h1>
          {user.currentPrefecture && (
            <div className="flex items-center gap-1 text-gray-600">
              <MapPinIcon className="w-4 h-4" />
              <span>{user.currentPrefecture}</span>
            </div>
          )}
        </div>
        <UserSocialLinks
          user={user}
          className="gap-4"
          isOwner={isOwner}
          onUpdate={isOwner ? onUpdateSocialLinks : undefined}
        />
      </div>

      <div className="text-gray-600 text-base leading-relaxed">
        <div className="relative">
          <p className={cn(
            "whitespace-pre-wrap",
            !isExpanded && "max-h-[4.5em] overflow-hidden"
          )}>
            {user.bio}
          </p>
          {shouldShowMore(user.bio) && !isExpanded && (
            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-b from-transparent to-white flex items-end justify-center">
              <Button
                variant="secondary"
                onClick={() => setIsExpanded(true)}
                className="w-40 h-10"
              >
                もっと見る
              </Button>
            </div>
          )}
          {isExpanded && (
            <div className="flex justify-center mt-2">
              <Button
                variant="secondary"
                onClick={() => setIsExpanded(false)}
                className="w-40 h-10"
              >
                閉じる
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}        