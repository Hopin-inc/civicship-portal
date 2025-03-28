'use client'

import { useRouter } from 'next/navigation'
import { Search, Calendar, Users } from 'lucide-react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

interface SearchFormProps {
  location?: string
  from?: string
  to?: string
  guests?: string
}

const SearchForm = ({ location, from, to, guests }: SearchFormProps) => {
  const router = useRouter()

  const getLocationText = () => {
    if (!location) return ''
    const prefMap: { [key: string]: string } = {
      kagawa: '香川県',
      tokushima: '徳島県',
      kochi: '高知県',
      ehime: '愛媛県',
    }
    return `${prefMap[location] || '場所を選択'}の体験`
  }

  const formatDateRange = () => {
    const fromDate = from ? new Date(from) : null
    const toDate = to ? new Date(to) : null
    
    if (!fromDate) return '日付未定'
    if (!toDate) {
      return format(fromDate, 'M/d', { locale: ja })
    }
    return `${format(fromDate, 'M/d', { locale: ja })}〜${format(toDate, 'M/d', { locale: ja })}`
  }

  const getGuestsText = () => {
    if (!guests) return '人数未定'
    return `${guests}人`
  }

  const handleClick = () => {
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    if (guests) params.set('guests', guests)
    
    router.push(`/search${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const hasAnyCondition = location || from || to || guests

  return (
    <button
      onClick={handleClick}
      className="flex flex-col w-full max-w-xl bg-gray-100 rounded-full h-12 px-4 text-left hover:bg-gray-200 transition-colors relative"
    >
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <Search className="h-6 w-6 text-gray-500" />
      </div>
      {!hasAnyCondition ? (
        <div className="flex items-center justify-center w-full h-full">
          <span className="text-sm text-gray-500">タップして検索する</span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <span className="text-sm font-medium text-gray-900">{getLocationText()}</span>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-xs text-gray-500">{formatDateRange()}</span>
            </div>
            <span className="text-xs text-gray-500 mx-1">・</span>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-xs text-gray-500">{getGuestsText()}</span>
            </div>
          </div>
        </div>
      )}
    </button>
  )
}

export default SearchForm 