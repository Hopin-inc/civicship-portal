import Image from 'next/image'
import { MapPin } from 'lucide-react'

interface OpportunityCardProps {
  title: string
  price: number
  location: string
  imageUrl: string
  vertical?: boolean
}

export default function OpportunityCard({
  title,
  price,
  location,
  imageUrl,
  vertical = false,
}: OpportunityCardProps) {
  return (
    <div className={`relative ${vertical ? 'w-full' : 'w-72'} flex-shrink-0`}>
      <div className="aspect-square w-full overflow-hidden rounded-lg">
        <Image
          src={imageUrl}
          alt={title}
          width={200}
          height={200}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <div className="mt-1 flex flex-col">
          <p className="text-sm text-gray-500">{`${price.toLocaleString()}円/人〜`}</p>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <MapPin className="mr-1 h-4 w-4" />
            {location}
          </div>
        </div>
      </div>
    </div>
  )
} 