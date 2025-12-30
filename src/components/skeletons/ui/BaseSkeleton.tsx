import SkeletonLib from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface BaseSkeletonProps {
  count?: number;
  duration?: number;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  className?: string;
  baseColor?: string;
  highlightColor?: string;
}

export function BaseSkeleton({
  count = 1,
  duration = 1.5,
  width,
  height,
  circle = false,
  className = "",
  baseColor = "#E5E7EB",
  highlightColor = "#F3F4F6",
}: BaseSkeletonProps) {
  return (
    <SkeletonLib
      count={count}
      duration={duration}
      width={width}
      height={height}
      circle={circle}
      className={className}
      baseColor={baseColor}
      highlightColor={highlightColor}
    />
  );
}
