"use client";

import Image, { ImageProps } from "next/image";
import { useState, useCallback, useEffect } from "react";
import { PLACEHOLDER_IMAGE, FALLBACK_IMAGE } from "@/utils";

export interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

/**
 * SafeImage component that handles image loading errors gracefully.
 * When an image fails to load (e.g., 403, 404 errors), it displays a fallback image
 * instead of retrying infinitely.
 *
 * This solves the issue where Next.js Image component's onError handler
 * setting img.src directly doesn't prevent infinite retries because
 * the component re-renders and tries to fetch the original URL again.
 *
 * Implements multi-stage fallback:
 * 1. Original src
 * 2. fallbackSrc (default: PLACEHOLDER_IMAGE)
 * 3. FALLBACK_IMAGE (data URI) as final fallback
 */
export function SafeImage({
  src,
  fallbackSrc = PLACEHOLDER_IMAGE,
  alt,
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const handleError = useCallback(() => {
    setImgSrc((prevSrc) => {
      if (prevSrc === src) {
        return fallbackSrc;
      }
      return FALLBACK_IMAGE;
    });
  }, [src, fallbackSrc]);

  return (
    <Image
      {...props}
      src={imgSrc || FALLBACK_IMAGE}
      alt={alt}
      onError={handleError}
    />
  );
}

export default SafeImage;
