'use client'

import { useEffect, useState } from 'react'
import { useHeader } from '@/contexts/HeaderContext'
import { Button } from '@/app/components/ui/button'
import { User, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useOpportunity } from '@/hooks/useOpportunity'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { useRouter } from 'next/navigation'

interface TimeSlot {
  time: string
  participants: number
  price: number
  id: string
  startsAt: string
  endsAt: string
}

interface DateSection {
  date: string
  day: string
  timeSlots: TimeSlot[]
}

export default function SelectDatePage({ searchParams }: { searchParams: { id: string; community_id: string } }) {
  const router = useRouter()
  const { updateConfig } = useHeader()
  const { opportunity, loading, error } = useOpportunity(searchParams.id, searchParams.community_id)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedGuests, setSelectedGuests] = useState<number>(1)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showGuestPicker, setShowGuestPicker] = useState(false)

  useEffect(() => {
    updateConfig({
      title: '日付をえらぶ',
      showBackButton: true,
      showLogo: false,
    })
  }, [updateConfig])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!opportunity) return <div>No opportunity found</div>

  const dateSections: DateSection[] = opportunity.slots?.edges?.reduce((acc: DateSection[], edge) => {
    if (!edge?.node) return acc

    const startDate = new Date(edge.node.startsAt)
    const endDate = new Date(edge.node.endsAt)
    const dateStr = format(startDate, 'M月d日', { locale: ja })
    const dayStr = format(startDate, 'E', { locale: ja })
    const timeStr = `${format(startDate, 'HH:mm')}~${format(endDate, 'HH:mm')}`
    const participants = edge.node.participations?.edges?.length || 0
    const price = opportunity.feeRequired || 0

    const existingSection = acc.find(section => section.date === dateStr)
    if (existingSection) {
      existingSection.timeSlots.push({
        time: timeStr,
        participants,
        price,
        id: edge.node.id,
        startsAt: String(edge.node.startsAt),
        endsAt: String(edge.node.endsAt)
      })
    } else {
      acc.push({
        date: dateStr,
        day: dayStr,
        timeSlots: [{
          time: timeStr,
          participants,
          price,
          id: edge.node.id,
          startsAt: String(edge.node.startsAt),
          endsAt: String(edge.node.endsAt)
        }]
      })
    }
    return acc
  }, []) || []

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setShowDatePicker(false)
  }

  const handleGuestSelect = (count: number) => {
    setSelectedGuests(count)
    setShowGuestPicker(false)
  }

  const handleReservation = (slot: TimeSlot) => {
    if (!selectedDate) return

    const params = new URLSearchParams({
      id: searchParams.id,
      community_id: searchParams.community_id,
      slot_id: slot.id,
      starts_at: slot.startsAt,
      ends_at: slot.endsAt,
      guests: selectedGuests.toString()
    })

    router.push(`/reservation/confirm?${params.toString()}`)
  }

  return (
    <main className="pt-16 px-4 pb-24">
      <div className="space-y-4 mb-8">
        <div className="relative">
          <button 
            className="w-full bg-gray-50 rounded-xl p-4"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="text-gray-500">日付</span>
              </div>
              <div>{selectedDate || '日付を選択'}</div>
            </div>
          </button>
          {showDatePicker && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border p-4">
              {dateSections.map((section, index) => (
                <button
                  key={index}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded-lg"
                  onClick={() => handleDateSelect(`${section.date} (${section.day})`)}
                >
                  {section.date} ({section.day})
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button 
            className="w-full bg-gray-50 rounded-xl p-4"
            onClick={() => setShowGuestPicker(!showGuestPicker)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-gray-500">人数</span>
              </div>
              <div>{selectedGuests}人</div>
            </div>
          </button>
          {showGuestPicker && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border p-4">
              {[1, 2, 3, 4, 5].map((count) => (
                <button
                  key={count}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded-lg"
                  onClick={() => handleGuestSelect(count)}
                >
                  {count}人
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {dateSections.map((section, index) => (
          <div key={index}>
            <h3 className="text-xl mb-4">{section.date} ({section.day})</h3>
            <div className="space-y-4">
              {section.timeSlots.map((slot, slotIndex) => (
                <div key={slotIndex} className="bg-white rounded-xl border p-6">
                  <div className="mb-4">
                    <p className="text-lg">{slot.time}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-gray-600">参加予定人数 {slot.participants}人</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold">{slot.price.toLocaleString()}円/人〜</p>
                    <Button
                      variant="default"
                      size="lg"
                      className="rounded-full"
                      onClick={() => handleReservation(slot)}
                      disabled={!selectedDate}
                    >
                      選択
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
} 