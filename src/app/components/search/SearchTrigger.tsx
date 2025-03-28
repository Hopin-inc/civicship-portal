'use client'

import { FC } from 'react'
import { MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'

const SearchTrigger: FC = () => {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push('/search')}
      className="w-full bg-white rounded-lg border border-gray-200 p-4 text-left"
    >
      <div className="flex items-center space-x-2">
        <MapPin className="h-5 w-5 text-gray-500" />
        <span className="text-gray-500">どこに行きますか？</span>
      </div>
    </button>
  )
}

export default SearchTrigger 