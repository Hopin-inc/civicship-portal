import Image from 'next/image'
import { MapPin } from 'lucide-react'
import Link from 'next/link'

export interface OpportunityCardProps {
  id: string
  title: string
  price: number | null
  location: string
  imageUrl: string | null
  vertical?: boolean
}

export default function OpportunityCard({
  id,
  title,
  price,
  location,
  imageUrl,
  vertical = false,
}: OpportunityCardProps) {
  return (
    <Link href={`/activities/${id}`} className={`relative ${vertical ? 'w-full' : 'w-72'} flex-shrink-0`}>
      <div className="aspect-square w-full overflow-hidden rounded-lg">
        <Image
          src={imageUrl || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96'}
          alt={title}
          width={400}
          height={400}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{title}</h3>
        <div className="mt-1 flex flex-col">
          <p className="text-sm text-gray-500">
            {price ? `${price.toLocaleString()}円/人〜` : '価格未定'}
          </p>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <MapPin className="mr-1 h-4 w-4" />
            {location}
          </div>
        </div>
      </div>
    </Link>
  )
} 