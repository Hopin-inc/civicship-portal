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
  const smallImageSize = size * 0.4;
  
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
            right: size * 0.1,
            bottom: size * 0.1
          }}
        >
          <Image
            src={smallImage || PLACEHOLDER_IMAGE}
            alt={smallImageAlt || "Small image"}
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
