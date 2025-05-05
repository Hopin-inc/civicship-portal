import {
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Globe,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import type { User, SocialLink, SocialLinkType } from "@/types";
import { useState, useMemo } from "react";
// import { UserSocialLinksEditModal } from "./UserSocialLinksEditModal";
import { cn } from "@/lib/utils";

type Props = {
  user: User;
  className?: string;
  isOwner?: boolean;
  onUpdate?: (socialLinks: SocialLink[]) => void;
};

const SOCIAL_LINKS: SocialLinkType[] = ['x', 'instagram', 'facebook'];

export const UserSocialLinks = ({
  user,
  className,
  isOwner,
  onUpdate,
}: Props) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const getSocialIcon = (type: SocialLinkType) => {
    switch (type) {
      case "x":
        return <Twitter className="w-4 h-4" />;
      case "instagram":
        return <Instagram className="w-4 h-4" />;
      case "facebook":
        return <Facebook className="w-4 h-4" />;
      case "youtube":
        return <Youtube className="w-4 h-4" />;
      case "website":
        return <Globe className="w-4 h-4" />;
    }
  };

  const getSocialLabel = (type: SocialLinkType) => {
    switch (type) {
      case "x":
        return "X (Twitter)";
      case "instagram":
        return "Instagram";
      case "facebook":
        return "Facebook";
      case "youtube":
        return "YouTube";
      case "website":
        return "Website";
    }
  };

  const getSocialUrl = (type: SocialLinkType): string | null => {
    switch (type) {
      case "x":
        return user.urlX ?? null;
      case "instagram":
        return user.urlInstagram ?? null;
      case "facebook":
        return user.urlFacebook ?? null;
      case "youtube":
        return user.urlYoutube ?? null;
      case "website":
        return user.urlWebsite ?? null;
    }
  };

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex gap-2">
          {SOCIAL_LINKS.map((type) => {
            const url = getSocialUrl(type);
            const isActive = !!url;

            return (
              <Button
                key={type}
                variant="tertiary"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-full",
                  isActive
                    ? "bg-muted hover:bg-muted/80"
                    : "bg-muted/50 text-muted-foreground/50 cursor-not-allowed hover:bg-muted/50"
                )}
                asChild
                disabled={!isActive}
              >
                <a
                  href={url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={getSocialLabel(type)}
                  onClick={(e) => {
                    if (!isActive) {
                      e.preventDefault();
                    }
                  }}
                >
                  {getSocialIcon(type)}
                </a>
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
};
