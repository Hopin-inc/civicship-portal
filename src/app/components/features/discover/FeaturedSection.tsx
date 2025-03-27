"use client";

import { useCallback } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { MapPin } from 'lucide-react'

interface FeaturedOpportunity {
  id: number
  title: string
  price: number
  location: string
  imageUrl: string
}

interface FeaturedSectionProps {
  opportunities: FeaturedOpportunity[]
}

export default function FeaturedSection({ opportunities }: FeaturedSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    containScroll: 'trimSnaps',
  })

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <section className="relative h-[70vh] w-full overflow-hidden">
      {/* タグライン */}
      <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-6 text-white">
        <h1 className="text-4xl font-bold leading-tight">
          四国にふれる
          <br />
          わたし、ふるえる
        </h1>
      </div>

      {/* カルーセル */}
      <div className="embla h-full" ref={emblaRef}>
        <div className="embla__container h-full">
          {opportunities.map((opportunity) => (
            <div key={opportunity.id} className="embla__slide relative h-full w-full flex-[0_0_100%]">
              {/* 背景画像 */}
              <div className="absolute inset-0">
                <Image
                  src={opportunity.imageUrl}
                  alt={opportunity.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* カード */}
              <div className="absolute inset-x-0 bottom-12 bg-gradient-to-t from-black/60 to-transparent px-6">
                <div className="mx-auto max-w-md">
                  <div className="flex overflow-hidden rounded-xl bg-white shadow-lg p-3">
                    <div className="relative h-[80px] w-[80px] flex-shrink-0">
                      <Image
                        src={opportunity.imageUrl}
                        alt={opportunity.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 pl-4">
                      <h2 className="text-lg font-bold text-gray-900 line-clamp-1">
                        {opportunity.title}
                      </h2>
                      <p className="mt-1 text-base text-gray-600">
                        {`${opportunity.price.toLocaleString()}円/人〜`}
                      </p>
                      <div className="mt-1 flex items-center text-gray-500 text-sm">
                        <MapPin className="mr-1 h-4 w-4" />
                        <span>{opportunity.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ナビゲーションボタン
        <button
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-lg transition hover:bg-white"
          onClick={scrollPrev}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-lg transition hover:bg-white"
          onClick={scrollNext}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button> */}
      </div>
    </section>
  )
} 