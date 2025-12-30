"use client";

import { useState, ReactNode } from "react";
import Image from "next/image";
import { FiCamera } from "react-icons/fi";

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
        className={`flex items-center justify-center bg-liner-to-br from-orange-400 to-orange-600 ${className}`}
      >
        {fallback || <FiCamera className="w-16 h-16 text-white opacity-80" />}
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
