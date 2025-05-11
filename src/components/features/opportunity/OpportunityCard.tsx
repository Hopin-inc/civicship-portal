import Image from 'next/image'
import { MapPin } from 'lucide-react'
import Link from 'next/link'
import { Card } from "@/components/ui/card"
import { ActivityCard } from "@/types/opportunity";

export default function OpportunityCard({
  id,
  title,
  feeRequired,
  location,
  images,
  communityId,
  hasReservableTicket
}: ActivityCard) {
  const vertical = false;

  return (
    <Link href={`/activities/${id}`} className={`relative ${vertical ? 'w-full' : 'w-[200px]'} flex-shrink-0`}>
      <Card className="w-[200px] h-[250px] overflow-hidden relative">
        {hasReservableTicket && (
          <div className="absolute top-2 left-2 bg-primary-foreground text-primary px-2 py-1 rounded-md text-xs font-medium z-10">
            チケット利用可
          </div>
        )}
        <Image
          src={(images?.[0]) || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96'}
          alt={title}
          width={400}
          height={400}
          className="h-full w-full object-cover"
        />
      </Card>
      <div className="mt-2">
        <h3 className="text-sm font-medium text-foreground line-clamp-2">{title}</h3>
        <div className="mt-1 flex flex-col">
          <p className="text-sm text-muted-foreground">
            {feeRequired ? `1人あたり${feeRequired.toLocaleString()}円から` : '要問い合わせ'}
          </p>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <MapPin className="mr-1 h-4 w-4" />
            {location}
          </div>
        </div>
      </div>
    </Link>
  )
}          