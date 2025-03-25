import {
  Twitter,
  Instagram,
  Facebook,
  Globe,
  MessageCircle,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User } from "@/types";
import { useState } from "react";
import { UserSocialLinksEditModal } from "./UserSocialLinksEditModal";

type Props = {
  user: User;
  className?: string;
  isOwner?: boolean;
  onUpdate?: (socialLinks: User["socialLinks"]) => void;
};

export const UserSocialLinks = ({
  user,
  className,
  isOwner,
  onUpdate,
}: Props) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const getSocialIcon = (type: string) => {
    switch (type) {
      case "twitter":
        return <Twitter className="w-4 h-4" />;
      case "instagram":
        return <Instagram className="w-4 h-4" />;
      case "facebook":
        return <Facebook className="w-4 h-4" />;
      case "line":
        return <MessageCircle className="w-4 h-4" />;
      case "website":
        return <Globe className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getSocialLabel = (type: string) => {
    switch (type) {
      case "twitter":
        return "Twitter";
      case "instagram":
        return "Instagram";
      case "facebook":
        return "Facebook";
      case "line":
        return "LINE";
      case "website":
        return "Website";
      default:
        return type;
    }
  };

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex gap-2">
          {user.socialLinks?.map((link) => (
            <Button
              key={link.type}
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-muted hover:bg-muted/80"
              asChild
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={getSocialLabel(link.type)}
              >
                {getSocialIcon(link.type)}
              </a>
            </Button>
          ))}
        </div>
      </div>
    </>
  );
};
