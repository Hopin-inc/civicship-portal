"use client";

import Image, { ImageProps } from "next/image";
import { useState, useCallback } from "react";
import { PLACEHOLDER_IMAGE } from "@/utils";

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
 */
export function SafeImage({
  src,
  fallbackSrc = PLACEHOLDER_IMAGE,
  alt,
  ...props
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleError = useCallback(() => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    }
  }, [hasError, fallbackSrc]);

  // Reset error state when src changes
  if (src !== currentSrc && !hasError) {
    setCurrentSrc(src);
  }

  return (
    <Image
      {...props}
      src={hasError ? fallbackSrc : currentSrc}
      alt={alt}
      onError={handleError}
    />
  );
}

export default SafeImage;
