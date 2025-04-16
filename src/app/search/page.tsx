'use client'

import { FC, useState, useEffect } from 'react'
import { MapPin, Calendar as CalendarIcon, Users, ArrowLeft, Share, X, Minus, Plus, ChevronRight, ChevronLeft, Tags } from 'lucide-react'
import Link from 'next/link'
import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Calendar } from '@/app/components/ui/calendar'
import { useHeader } from '@/contexts/HeaderContext'
import { useRouter } from 'next/navigation'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/app/components/ui/sheet'

const PREFECTURES = [
  { id: 'kagawa', name: '香川県' },
  { id: 'tokushima', name: '徳島県' },
  { id: 'kochi', name: '高知県' },
  { id: 'ehime', name: '愛媛県' },
]

export default function Page() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState<'activity' | 'quest'>('activity')
  const [activeForm, setActiveForm] = useState<'location' | 'date' | 'guests' | 'other' | null>(null)
  const [location, setLocation] = useState<string>('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [guests, setGuests] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [useTicket, setUseTicket] = useState(false)
  const { updateConfig, resetConfig } = useHeader()

  useEffect(() => {
    updateConfig({
      showLogo: false,
      title: '体験・お手伝いを検索',
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

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return ''
    if (!range.to) return format(range.from, 'M/d', { locale: ja })
    return `${format(range.from, 'M/d', { locale: ja })} - ${format(range.to, 'M/d', { locale: ja })}`
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (location) params.set('location', location)
    if (dateRange?.from) params.set('from', dateRange.from.toISOString())
    if (dateRange?.to) params.set('to', dateRange.to.toISOString())
    if (guests > 0) params.set('guests', guests.toString())
    if (useTicket) params.set('ticket', 'true')
    params.set('type', selectedTab)
    
    router.push(`/search/result?${params.toString()}`)
  }

  const getSheetHeight = () => {
    switch (activeForm) {
      case 'location':
        return 'h-[300px]'
      case 'date':
        return 'h-[85vh]'
      case 'guests':
        return 'h-[300px]'
      case 'other':
        return 'h-[300px]'
      default:
        return 'h-auto'
    }
  }

  const renderSheetContent = () => {
    if (!activeForm) return null

    const renderFooterButtons = () => (
      <div className="absolute bottom-0 left-0 right-0 bg-white p-4">
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              switch (activeForm) {
                case 'location':
                  setLocation('');
                  break;
                case 'date':
                  setDateRange(undefined);
                  break;
                case 'guests':
                  setGuests(0);
                  break;
                case 'other':
                  setUseTicket(false);
                  break;
              }
            }}
            className="text-gray-500 text-sm"
          >
            選択を解除
          </button>
          <button
            onClick={() => setActiveForm(null)}
            className="bg-blue-600 text-white px-8 py-3 rounded-2xl"
          >
            決定
          </button>
        </div>
      </div>
    );

    const content = {
      location: (
        <div className="h-full pb-20 relative">
          <SheetHeader className="text-left pb-6">
            <SheetTitle>
              <div className="flex items-center">
                <span className="text-lg font-bold">場所を選択</span>
              </div>
            </SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-2 gap-2">
            {PREFECTURES.map((pref) => (
              <button
                key={pref.id}
                onClick={() => {
                  setLocation(pref.id)
                }}
                className={`py-3 rounded-lg border ${
                  location === pref.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-gray-200 text-gray-900'
                }`}
              >
                {pref.name}
              </button>
            ))}
          </div>
          {renderFooterButtons()}
        </div>
      ),
      date: (
        <div className="h-full flex flex-col relative">
          <SheetHeader className="text-left pb-6">
            <SheetTitle>
              <div className="flex items-center">
                <span className="text-lg font-bold">日付を選択</span>
              </div>
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-auto pb-24">
            <div className="-mx-6 px-4">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                locale={ja}
                className="w-full"
                fromDate={new Date()}
                numberOfMonths={6}
                showOutsideDays={false}
                classNames={{
                  months: "space-y-8",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center text-xl font-medium",
                  caption_label: "text-lg font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex justify-between mb-2",
                  head_cell: "text-gray-500 w-10 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2 justify-between",
                  cell: "relative p-0 text-center text-[16px] w-10",
                  day: "h-10 w-10 p-0 font-normal hover:bg-gray-100 flex items-center justify-center rounded-full",
                  day_selected: "bg-blue-600 text-white hover:bg-blue-600 focus:bg-blue-600",
                  day_today: "bg-gray-100",
                  day_outside: "text-gray-400 opacity-50",
                  day_disabled: "text-gray-400 opacity-50",
                  day_hidden: "invisible",
                }}
                components={{
                  IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
                  IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
                }}
                formatters={{
                  formatCaption: (date) => {
                    return `${date.getFullYear()}年${date.getMonth() + 1}月`
                  }
                }}
              />
            </div>
          </div>
          {renderFooterButtons()}
        </div>
      ),
      guests: (
        <div className="h-full pb-20 relative">
          <SheetHeader className="text-left pb-6">
            <SheetTitle>
              <div className="flex items-center">
                <span className="text-lg font-bold">人数を選択</span>
              </div>
            </SheetTitle>
          </SheetHeader>
          <div className="flex items-center justify-center space-x-8 py-4">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setGuests(Math.max(0, guests - 1))
              }}
              className="rounded-full border border-gray-200 p-2 hover:bg-gray-50"
            >
              <Minus className="h-6 w-6 text-gray-400" />
            </button>
            <span className="text-2xl font-medium w-8 text-center">{guests}</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setGuests(guests + 1)
              }}
              className="rounded-full border border-gray-200 p-2 hover:bg-gray-50"
            >
              <Plus className="h-6 w-6 text-gray-400" />
            </button>
          </div>
          {renderFooterButtons()}
        </div>
      ),
      other: (
        <div className="h-full pb-20 relative">
          <SheetHeader className="text-left pb-6">
            <SheetTitle>
              <div className="flex items-center">
                <span className="text-lg font-bold">その他の条件</span>
              </div>
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={useTicket}
                onChange={(e) => setUseTicket(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">チケットで支払える</span>
            </label>
          </div>
          {renderFooterButtons()}
        </div>
      ),
    }[activeForm]

    return content
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 bg-white border-b z-10">
        <div className="relative h-14 flex items-center justify-center px-4">
          <Link href="/" className="absolute left-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-lg font-medium">体験・お手伝いを検索</h1>
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

      <main className="pt-20 px-4 pb-16">
        <div className="mb-6">
          <div className="flex">
            <button
              onClick={() => setSelectedTab('activity')}
              className={`flex-1 pb-3 text-center text-xl relative ${
                selectedTab === 'activity'
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-400'
              }`}
            >
              体験
              {selectedTab === 'activity' && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600" />
              )}
            </button>
            <button
              onClick={() => setSelectedTab('quest')}
              className={`flex-1 pb-3 text-center text-xl relative ${
                selectedTab === 'quest'
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-400'
              }`}
            >
              お手伝い
              {selectedTab === 'quest' && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="検索ワードを入力"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white outline-none text-base placeholder:text-gray-400"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
            <button
              onClick={() => setActiveForm('location')}
              className="w-full px-4 py-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <MapPin className="h-6 w-6 text-gray-400" />
                <span className={`text-base ${location ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                  場所
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-base">
                  {location ? PREFECTURES.find(p => p.id === location)?.name : '場所を指定'}
                </span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </button>

            <button
              onClick={() => setActiveForm('date')}
              className="w-full px-4 py-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <CalendarIcon className="h-6 w-6 text-gray-400" />
                <span className={`text-base ${dateRange?.from ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                  日付
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-base">
                  {dateRange?.from ? formatDateRange(dateRange) : '日付を追加'}
                </span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </button>

            <button
              onClick={() => setActiveForm('guests')}
              className="w-full px-4 py-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <Users className="h-6 w-6 text-gray-400" />
                <span className={`text-base ${guests > 0 ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                  人数
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-base">
                  {guests > 0 ? `${guests}人` : '人数を指定'}
                </span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </button>

            <button
              onClick={() => setActiveForm('other')}
              className="w-full px-4 py-4 flex items-center justify-between"
            >
              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-4">
                  <Tags className="h-6 w-6 text-gray-400" />
                  <span className={`text-base ${useTicket ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                    その他の条件
                  </span>
                </div>
                {useTicket && (
                  <div className="pl-10 text-base">
                    チケットで支払える
                  </div>
                )}
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t z-10">
        <div className="max-w-lg mx-auto px-4 h-16 flex justify-between items-center">
          <button 
            onClick={handleClear}
            className="text-gray-500 text-sm"
          >
            条件をクリア
          </button>
          <button 
            onClick={handleSearch}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium"
          >
            検索
          </button>
        </div>
      </footer>

      <Sheet open={activeForm !== null} onOpenChange={(open) => !open && setActiveForm(null)}>
        <SheetContent 
          side="bottom" 
          className={`${getSheetHeight()} rounded-t-3xl overflow-auto max-w-lg mx-auto`}
          onPointerDownOutside={() => setActiveForm(null)}
        >
          {renderSheetContent()}
        </SheetContent>
      </Sheet>
    </div>
  )
} 