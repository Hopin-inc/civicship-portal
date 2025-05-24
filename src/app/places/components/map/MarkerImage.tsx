"use client";

import React, { useEffect, useState } from "react";
import CircleImage from "./CircleImage";
import { PLACEHOLDER_IMAGE } from "@/utils";

interface MarkerImageProps {
  mainImage: string;
  hostImage: string;
  size: number;
  isSelected: boolean;
  onLoad?: (dataUrl: string) => void;
}

const MarkerImage: React.FC<MarkerImageProps> = ({
  mainImage,
  hostImage,
  size,
  isSelected,
  onLoad,
}) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const generateDataUrl = async () => {
      if (onLoad) {
        onLoad(mainImage);
      }
    };

    generateDataUrl();
  }, [mainImage, hostImage, size, isSelected, onLoad]);

  return (
    <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
      <CircleImage
        src={mainImage || PLACEHOLDER_IMAGE}
        alt="Marker"
        size={size}
        isSelected={isSelected}
        priority={true}
        smallImage={hostImage || PLACEHOLDER_IMAGE}
        smallImageAlt="Host"
      />
    </div>
  );
};

export default MarkerImage;
