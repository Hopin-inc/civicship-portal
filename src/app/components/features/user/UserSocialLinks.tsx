import {
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User, SocialLink, SocialLinkType } from "@/types";
import { useState, useMemo } from "react";
import { UserSocialLinksEditModal } from "./UserSocialLinksEditModal";

type Props = {
  user: User;
  className?: string;
  isOwner?: boolean;
  onUpdate?: (socialLinks: SocialLink[]) => void;
};

export const UserSocialLinks = ({
  user,
  className,
  isOwner,
  onUpdate,
}: Props) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const socialLinks = useMemo(() => {
    const links: SocialLink[] = [];
    
    if (user.urlX) {
      links.push({ type: 'x', url: user.urlX });
    }
    if (user.urlInstagram) {
      links.push({ type: 'instagram', url: user.urlInstagram });
    }
    if (user.urlFacebook) {
      links.push({ type: 'facebook', url: user.urlFacebook });
    }
    if (user.urlYoutube) {
      links.push({ type: 'youtube', url: user.urlYoutube });
    }
    if (user.urlWebsite) {
      links.push({ type: 'website', url: user.urlWebsite });
    }
    
    return links;
  }, [user]);

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

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex gap-2">
          {socialLinks.map((link) => (
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
