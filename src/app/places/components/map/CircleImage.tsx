"use client";

import React from "react";
import Image from "next/image";
import { PLACEHOLDER_IMAGE } from "@/utils";
import styles from "./CircleImage.module.css";

interface CircleImageProps {
  src: string;
  alt: string;
  size: number;
  isSelected?: boolean;
  priority?: boolean;
  className?: string;
  smallImage?: string;
  smallImageAlt?: string;
}

const CircleImage: React.FC<CircleImageProps> = ({
  src,
  alt,
  size,
  isSelected = false,
  priority = false,
  className = "",
  smallImage,
  smallImageAlt,
}) => {
  const mainRadius = size / 2 - 2;
  const smallRadius = mainRadius * 0.4;
  const smallImageSize = smallRadius * 2;
  
  return (
    <div
      className={`${styles.circleImageContainer} ${isSelected ? styles.selected : ""} ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={src || PLACEHOLDER_IMAGE}
        alt={alt}
        fill
        sizes={`${size}px`}
        className={styles.circleImage}
        priority={priority}
        placeholder="blur"
        blurDataURL={PLACEHOLDER_IMAGE}
        crossOrigin="anonymous"
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.src = PLACEHOLDER_IMAGE;
        }}
      />
      
      {smallImage && (
        <div 
          className={styles.smallImageContainer}
          style={{ 
            width: smallImageSize, 
            height: smallImageSize,
            position: 'absolute',
            left: `calc(50% + ${mainRadius * 0.5 - smallRadius}px)`,
            top: `calc(50% + ${mainRadius * 0.5 - smallRadius}px)`
          }}
        >
          <Image
            src={smallImage || PLACEHOLDER_IMAGE}
            alt={smallImageAlt || "Host"}
            fill
            sizes={`${smallImageSize}px`}
            className={styles.circleImage}
            crossOrigin="anonymous"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = PLACEHOLDER_IMAGE;
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CircleImage;
