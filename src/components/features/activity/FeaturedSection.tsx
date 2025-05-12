'use client';

import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { MapPin } from 'lucide-react';
import { ActivityCard } from '@/types/opportunity';
import { useEffect, useState } from "react";

interface FeaturedSectionProps {
  opportunities: ActivityCard[];
}

export default function FeaturedSection({ opportunities }: FeaturedSectionProps) {
  const [emblaRef] = useEmblaCarousel({
    loop: true,
    align: 'center',
    containScroll: 'trimSnaps',
  });

  if (opportunities.length === 0) return null;

  return (
    <section className="relative h-[70vh] w-full overflow-hidden [&]:mt-0">
      <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/60 to-transparent py-10 px-8 text-white">
        <h1 className="text-4xl font-bold leading-tight">
          四国にふれる
          <br />
          わたし、ふるえる
        </h1>
      </div>

      <div className="embla h-full" ref={emblaRef}>
        <div className="embla__container h-full">
          {opportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className="embla__slide relative h-full w-full flex-[0_0_100%]"
            >
              <OpportunityImageSlider
                images={opportunity.images ?? []}
                title={opportunity.title}
              />
              <OpportunityCard opportunity={opportunity} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OpportunityCard({ opportunity }: { opportunity: ActivityCard }) {
  return (
    <Link
      href={`/activities/${opportunity.id}`}
      className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/60 via-black/40 to-transparent px-6 pb-8 pt-16"
    >
    <div className="mx-auto max-w-md">
        <div className="flex overflow-hidden rounded-xl bg-background shadow-lg">
          <div className="relative h-[108px] w-[88px] flex-shrink-0">
            <Image
              src={opportunity.images?.[0] ?? "https://images.unsplash.com/photo-1578662996442-48f60103fc96"}
              alt={`${opportunity.title}`}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="flex-1 px-4 p-3">
            <h2 className="text-title-md text-foreground line-clamp-1">{opportunity.title}</h2>
            <p className="mt-1 text-body-sm text-muted-foreground">
              {opportunity.feeRequired
                ? `1人当たり${opportunity.feeRequired.toLocaleString()}円から`
                : '要問い合わせ'}
            </p>
            <div className="mt-1 flex items-center text-muted-foreground text-body-sm">
              <MapPin className="mr-1 h-4 w-4" />
              <span>{opportunity.location}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function OpportunityImageSlider({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);

  const slideImages = images.length > 0 ? images : [undefined];

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevIndex(index);
      setIndex((prev) => (prev + 1) % slideImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [index, slideImages.length]);

  return (
    <div className="absolute inset-0 z-0">
      {slideImages.map((img, i) => {
        const isActive = i === index;
        const isPrevious = i === prevIndex;
        return (
          <Image
            key={i}
            src={img ?? 'https://images.unsplash.com/photo-1578662996442-48f60103fc96'}
            alt={`${title} - ${i + 1}`}
            fill
            className={`object-cover transition-opacity duration-1000 ease-in-out
              ${isActive ? 'opacity-100' : isPrevious ? 'opacity-0' : 'hidden'}`}
            priority={i === 0}
          />
        );
      })}
      <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 flex gap-2">
        {slideImages.map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full transition-colors duration-300 ${
              i === index ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}