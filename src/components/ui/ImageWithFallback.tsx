"use client";

import { useState, ReactNode } from "react";
import Image from "next/image";
import { AiOutlinePicture } from "react-icons/ai";

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  fallback?: ReactNode;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  quality?: number;
}

export function ImageWithFallback({
  src,
  alt,
  fallback,
  className = "",
  fill = false,
  width,
  height,
  sizes,
  priority = false,
  quality = 75,
}: ImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div
        className={`h-full flex items-center justify-center bg-gradient-to-br from-red-600 via-orange-600 to-red-600 ${className}`}
      >
        {fallback || (
          <AiOutlinePicture className="w-16 h-16 text-white opacity-80" />
        )}
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
        quality={quality}
        onError={() => setImageError(true)}
      />
    );
  }

  // Validate width and height are provided when fill is false
  if (!width || !height) {
    // Fall back to placeholder if dimensions are missing
    return (
      <div
        className={`h-full flex items-center justify-center bg-gradient-to-br from-red-600 via-orange-600 to-red-600 ${className}`}
        style={{ minWidth: 100, minHeight: 100 }}
      >
        {fallback || (
          <AiOutlinePicture className="w-16 h-16 text-white opacity-80" />
        )}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      quality={quality}
      onError={() => setImageError(true)}
    />
  );
}
