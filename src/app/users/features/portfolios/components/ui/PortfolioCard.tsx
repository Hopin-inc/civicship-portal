import { Calendar, MapPin, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { RefObject } from "react";
import { ParticipantsList } from "@/components/shared/ParticipantsList";
import { PortfolioCardViewModel } from "../../presenters/viewModels";
import { PLACEHOLDER_IMAGE, FALLBACK_IMAGE } from "@/utils";
import { useTranslations } from "next-intl";

type PortfolioCardProps = {
  viewModel: PortfolioCardViewModel;
  isLast: boolean;
  lastRef: RefObject<HTMLDivElement>;
};

export const PortfolioCard = ({ viewModel, isLast, lastRef }: PortfolioCardProps) => {
  const t = useTranslations();
  return (
    <Link href={viewModel.linkHref} className="block w-full">
      <div
        ref={isLast ? lastRef : undefined}
        className="rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
      >
        <div className="relative w-full aspect-[164/205]">
          <Image
            src={viewModel.image}
            alt={viewModel.title}
            fill
            className="object-cover"
            placeholder={"blur"}
            blurDataURL={PLACEHOLDER_IMAGE}
            sizes="(min-width: 640px) 50vw, 100vw"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = FALLBACK_IMAGE;
            }}
          />
          {viewModel.showShield ? (
            <div className="absolute top-2 left-2 z-10">
              <div className="bg-primary-foreground rounded-full w-6 h-6 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
            </div>
          ) : (
            viewModel.badge && (
              <div className="absolute top-2 left-2 z-10">
                <div
                  className={`px-2 py-1 text-label-sm rounded-full font-bold ${viewModel.badge.variantClasses}`}
                >
                  {t(viewModel.badge.labelKey as any)}
                </div>
              </div>
            )
          )}
          {viewModel.participants && viewModel.participants.length > 0 && (
            <div className="absolute bottom-2 left-2 right-2 z-10">
              <div className="flex items-center justify-between">
                <ParticipantsList participants={viewModel.participants} size="md" />
              </div>
            </div>
          )}
        </div>
        <div className="py-3 space-y-2">
          <h3 className="text-body-sm line-clamp-2 font-bold">{viewModel.title}</h3>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-body-sm text-caption">
              <Calendar className="w-4 h-4" />
              <span>
                {viewModel.dateDisplay}
                {viewModel.showScheduleBadge && (
                  <span className="bg-ring pl-1.5 pr-2 py-0.5 rounded-lg ml-1">
                    {t("users.portfolio.badge.scheduled")}
                  </span>
                )}
              </span>
            </div>
            {viewModel.location && (
              <div className="flex items-center gap-1 text-body-sm text-caption">
                <MapPin className="w-4 h-4" />
                <span>{viewModel.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
