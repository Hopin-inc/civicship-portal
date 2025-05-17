import React from "react";
import { Button } from "@/components/ui/button";
import { AsymmetricImageGrid } from "@/components/ui/asymmetric-image-grid";

const emptyImages = [
  {
    url: "/images/tickets/empty-1.jpg",
    alt: "体験の様子1",
  },
  {
    url: "/images/tickets/empty-2.jpg",
    alt: "体験の様子2",
  },
  {
    url: "/images/tickets/empty-3.jpg",
    alt: "体験の様子3",
  },
];

interface EmptyStateProps {
  title?: string;
  description?: string | React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  hideActionButton?: boolean;
  icon?: React.ReactNode;
  images?: Array<{ url: string; alt: string }>;
}

export default function EmptyStateWithSearch({
  title = "チケットはありません",
  description = (
    <>
      四国の素敵な88人と関わって
      <br />
      チケットをもらおう
    </>
  ),
  actionLabel = "関わりをみつける",
  onAction = () => (window.location.href = "/"),
  hideActionButton = false,
  icon,
  images = emptyImages,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center mt-8">
      {icon ? (
        <div className="mb-6">{icon}</div>
      ) : (
        <div className="w-[224px] h-[220px] mb-8">
          <AsymmetricImageGrid images={images} className="h-full" />
        </div>
      )}

      <h2 className="text-display-md mb-1">{title}</h2>
      <div className="text-muted-foreground mb-4">
        {typeof description === "string" ? (
          <p className="whitespace-pre-line text-body-md">{description}</p>
        ) : (
          description
        )}
      </div>

      {!hideActionButton && (
        <Button variant="primary" size="lg" className="px-16" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
