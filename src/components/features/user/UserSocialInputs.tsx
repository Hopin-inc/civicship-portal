
import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UserSocialInputsProps {
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  setSocialLinks: (links: { facebook: string; instagram: string; twitter: string }) => void;
}

export const UserSocialInputs: React.FC<UserSocialInputsProps> = ({
  socialLinks,
  setSocialLinks
}) => {
  return (
    <div className="mb-8">
      <Label className="block mb-2">SNSリンク</Label>
      <div className="space-y-4">
        <div className="relative">
          <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <Input
            value={socialLinks.facebook}
            onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
            placeholder="https://"
            type="url"
            className="pl-11"
          />
        </div>
        <div className="relative">
          <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <Input
            value={socialLinks.instagram}
            onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
            placeholder="https://"
            type="url"
            className="pl-11"
          />
        </div>
        <div className="relative">
          <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <Input
            value={socialLinks.twitter}
            onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
            placeholder="https://"
            type="url"
            className="pl-11"
          />
        </div>
      </div>
    </div>
  );
};

export default UserSocialInputs;
