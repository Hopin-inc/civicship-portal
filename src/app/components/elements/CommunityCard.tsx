import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/app/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { MapPin, Users } from "lucide-react";

interface CommunityCardProps {
  id: string;
  name: string;
  image: string;
  location: string;
  members: {
    id: string;
    name: string;
    avatar: string;
  }[];
  totalMembers: number;
}

const CommunityCard: React.FC<CommunityCardProps> = ({
  id,
  name,
  image,
  location,
  members,
  totalMembers,
}) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative h-48 w-full">
          <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{name}</h2>
          <p className="text-sm text-muted-foreground flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {location}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-muted/50">
        <div className="flex -space-x-2 overflow-hidden">
          {members.slice(0, 5).map((member) => (
            <Avatar key={member.id} className="inline-block border-2 border-background">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback>{member.name[0]}</AvatarFallback>
            </Avatar>
          ))}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-1" />
          {totalMembers} メンバー
        </div>
      </CardFooter>
    </Card>
  );
};

export default CommunityCard;
