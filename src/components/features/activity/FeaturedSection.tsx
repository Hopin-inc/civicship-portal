"use client";

import { useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import { MapPin } from 'lucide-react'
import { OpportunityCardProps } from '../opportunity/OpportunityCard'

interface FeaturedSectionProps {
  opportunities: OpportunityCardProps[]
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

  if (opportunities.length === 0) {
    return null
  }

  return (
    <section className="relative h-[70vh] w-full overflow-hidden [&]:mt-0">
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
                  src={opportunity.imageUrl || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96'}
                  alt={opportunity.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* カード */}
              <Link
                href={`/activities/${opportunity.id}`}
                className="absolute inset-x-0 bottom-12 bg-gradient-to-t from-black/60 to-transparent px-6"
              >
                <div className="mx-auto max-w-md">
                  <div className="flex overflow-hidden rounded-xl bg-background shadow-lg p-3">
                    <div className="relative h-[80px] w-[80px] flex-shrink-0">
                      <Image
                        src={opportunity.imageUrl || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96'}
                        alt={opportunity.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 pl-4">
                      <h2 className="text-lg font-bold text-foreground line-clamp-1">
                        {opportunity.title}
                      </h2>
                      <p className="mt-1 text-base text-muted-foreground">
                        {opportunity.price ? `${opportunity.price.toLocaleString()}円/人〜` : '価格未定'}
                      </p>
                      <div className="mt-1 flex items-center text-muted-foreground text-sm">
                        <MapPin className="mr-1 h-4 w-4" />
                        <span>{opportunity.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
