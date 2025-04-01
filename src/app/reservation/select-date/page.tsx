'use client'

import { useEffect, useState } from 'react'
import { useHeader } from '@/contexts/HeaderContext'
import { Button } from '@/app/components/ui/button'
import { User, Calendar } from 'lucide-react'
import Link from 'next/link'

interface TimeSlot {
  time: string
  participants: number
  price: number
}

interface DateSection {
  date: string
  day: string
  timeSlots: TimeSlot[]
}

const mockDateSections: DateSection[] = [
  {
    date: '7月25日',
    day: '木',
    timeSlots: [
      { time: '13:30~15:30', participants: 5, price: 2000 },
      { time: '13:30~15:30', participants: 3, price: 2000 },
    ]
  },
  {
    date: '7月26日',
    day: '金',
    timeSlots: [
      { time: '13:30~15:30', participants: 3, price: 2000 },
    ]
  }
]

export default function SelectDatePage() {
  const { updateConfig } = useHeader()
  const [selectedDate, setSelectedDate] = useState('2025年7月25日(木) ~ 29日(火)')
  const [selectedGuests, setSelectedGuests] = useState('3人')

  useEffect(() => {
    updateConfig({
      title: '日付をえらぶ',
      showBackButton: true,
      showLogo: false,
    })
  }, [updateConfig])

  return (
    <main className="pt-16 px-4 pb-24">
      <div className="space-y-4 mb-8">
        <button className="w-full bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span className="text-gray-500">日付</span>
            </div>
            <div>{selectedDate}</div>
          </div>
        </button>

        <button className="w-full bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-500" />
              <span className="text-gray-500">人数</span>
            </div>
            <div>{selectedGuests}</div>
          </div>
        </button>
      </div>

      <div className="space-y-8">
        {mockDateSections.map((section, index) => (
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
                    <Link href="/reservation/confirm">
                      <Button
                        variant="default"
                        size="lg"
                        className="rounded-full"
                      >
                        選択
                      </Button>
                    </Link>
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