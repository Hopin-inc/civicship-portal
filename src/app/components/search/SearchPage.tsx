'use client'

import { FC, useState, useRef, useEffect } from 'react'
import { MapPin, Calendar as CalendarIcon, Users, ArrowLeft, Share, X, Minus, Plus } from 'lucide-react'
import Link from 'next/link'
import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Calendar } from '@/app/components/ui/calendar'
import { useHeader } from '@/contexts/HeaderContext'
import { useRouter } from 'next/navigation'

const PREFECTURES = [
  { id: 'kagawa', name: '香川県' },
  { id: 'tokushima', name: '徳島県' },
  { id: 'kochi', name: '高知県' },
  { id: 'ehime', name: '愛媛県' },
]

const SearchPage: FC = () => {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState<'experience' | 'quest'>('experience')
  const [activeForm, setActiveForm] = useState<'location' | 'date' | 'guests' | null>(null)
  const [location, setLocation] = useState<string>('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [guests, setGuests] = useState(0)
  const { updateConfig, resetConfig } = useHeader()
  
  const locationFormRef = useRef<HTMLDivElement>(null)
  const dateFormRef = useRef<HTMLDivElement>(null)
  const guestsFormRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    updateConfig({
      showLogo: false,
      title: '体験・クエストを検索',
      showBackButton: true
    })

    return () => {
      resetConfig()
    }
  }, [])

  const handleClear = () => {
    setLocation('')
    setDateRange(undefined)
    setGuests(0)
    setActiveForm(null)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const isLocationForm = locationFormRef.current?.contains(target)
      const isDateForm = dateFormRef.current?.contains(target)
      const isGuestsForm = guestsFormRef.current?.contains(target)

      if (!isLocationForm && !isDateForm && !isGuestsForm) {
        setActiveForm(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return ''
    if (!range.to) return format(range.from, 'M/d', { locale: ja })
    return `${format(range.from, 'M/d', { locale: ja })} - ${format(range.to, 'M/d', { locale: ja })}`
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 bg-white border-b z-10">
        <div className="relative h-14 flex items-center justify-center px-4">
          <Link href="/" className="absolute left-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-base font-medium">体験・クエストを検索</h1>
          <div className="absolute right-4 flex items-center space-x-4">
            <button>
              <Share className="h-6 w-6" />
            </button>
            <Link href="/">
              <X className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 px-4 pb-24">
        {/* Tabs */}
        <div className="mb-6">
          <div className="flex bg-gray-100 p-1 rounded-full">
            <button
              onClick={() => setSelectedTab('experience')}
              className={`flex-1 py-2.5 text-center rounded-full text-sm font-medium transition-colors ${
                selectedTab === 'experience'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600'
              }`}
            >
              体験
            </button>
            <button
              onClick={() => setSelectedTab('quest')}
              className={`flex-1 py-2.5 text-center rounded-full text-sm font-medium transition-colors ${
                selectedTab === 'quest'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600'
              }`}
            >
              クエスト
            </button>
          </div>
        </div>

        <div className="mb-6">
          {activeForm === 'location' ? (
            <div ref={locationFormRef} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="h-6 w-6 text-gray-400" />
                <span className="text-lg">どこに行きますか？</span>
              </div>
              <button
                onClick={() => {
                  setLocation('')
                }}
                className={`w-full mb-3 py-3 text-center rounded-lg border ${
                  location === ''
                    ? 'border-blue-600 text-blue-600'
                    : 'border-gray-200 text-gray-400'
                }`}
              >
                未定
              </button>
              <div className="grid grid-cols-2 gap-2">
                {PREFECTURES.map((pref) => (
                  <button
                    key={pref.id}
                    onClick={() => {
                      setLocation(pref.id)
                    }}
                    className={`py-3 rounded-lg border ${
                      location === pref.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-gray-200 text-gray-900'
                    }`}
                  >
                    {pref.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              onClick={() => setActiveForm('location')}
              className="w-full bg-gray-50 rounded-2xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-500">場所</span>
              </div>
              <span className="text-gray-900">
                {location ? PREFECTURES.find(p => p.id === location)?.name : '場所を指定'}
              </span>
            </button>
          )}
        </div>

        <div className="mb-6">
          {activeForm === 'date' ? (
            <div ref={dateFormRef} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start space-x-3 mb-6">
                <CalendarIcon className="h-7 w-7 text-gray-500" strokeWidth={1.5} />
                <span className="text-2xl">いつ行きますか？</span>
              </div>
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                locale={ja}
                className="w-full"
                fromDate={new Date()}
                formatters={{
                  formatCaption: (date) => {
                    return `${date.getFullYear()}年${date.getMonth() + 1}月`
                  }
                }}
              />
            </div>
          ) : (
            <button
              onClick={() => setActiveForm('date')}
              className="w-full bg-gray-50 rounded-2xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-500">日付</span>
              </div>
              <span className="text-gray-900">
                {dateRange?.from ? formatDateRange(dateRange) : '日付を追加'}
              </span>
            </button>
          )}
        </div>

        <div className="mb-6">
          {activeForm === 'guests' ? (
            <div ref={guestsFormRef} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="h-6 w-6 text-gray-400" />
                <span className="text-lg">何人で行きますか？</span>
              </div>
              <div className="flex items-center justify-center space-x-8 py-4">
                <button
                  onClick={() => setGuests(Math.max(0, guests - 1))}
                  className="rounded-full border border-gray-200 p-2 hover:bg-gray-50"
                >
                  <Minus className="h-6 w-6 text-gray-400" />
                </button>
                <span className="text-2xl font-medium w-8 text-center">{guests}</span>
                <button
                  onClick={() => setGuests(guests + 1)}
                  className="rounded-full border border-gray-200 p-2 hover:bg-gray-50"
                >
                  <Plus className="h-6 w-6 text-gray-400" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setActiveForm('guests')}
              className="w-full bg-gray-50 rounded-2xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-400" />
                <span className="text-gray-500">人数</span>
              </div>
              <span className="text-gray-900">
                {guests > 0 ? `${guests}人` : '人数を指定'}
              </span>
            </button>
          )}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-lg mx-auto px-4 h-16 flex justify-between items-center">
          <button 
            onClick={handleClear}
            className="text-blue-600 underline text-sm"
          >
            条件をクリア
          </button>
          <button 
            onClick={() => {
              const params = new URLSearchParams()
              if (location) params.set('location', location)
              if (dateRange?.from) params.set('from', dateRange.from.toISOString())
              if (dateRange?.to) params.set('to', dateRange.to.toISOString())
              if (guests > 0) params.set('guests', guests.toString())
              params.set('type', selectedTab)
              
              router.push(`/search/result?${params.toString()}`)
            }}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium"
          >
            検索
          </button>
        </div>
      </footer>
    </div>
  )
}

export default SearchPage 