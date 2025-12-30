import type { SkeletonProps } from "@/types/components";

export function Skeleton({
  variant = "rectangular",
  width,
  height,
  className = "",
  children,
}: SkeletonProps) {
  const baseClasses = "animate-pulse bg-gray-200";

  const variantClasses = {
    text: "rounded",
    rectangular: "rounded-lg",
    circular: "rounded-full",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height)
    style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={Object.keys(style).length > 0 ? style : undefined}
    >
      {children}
    </div>
  );
}

export function SkeletonText({
  lines = 1,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          height="1rem"
          className={`${index === lines - 1 && lines > 1 ? "w-3/4" : "w-full"}`}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}
    >
      <Skeleton variant="rectangular" height="12rem" />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" height="1.5rem" />
        <SkeletonText lines={2} />
        <div className="flex gap-2">
          <Skeleton variant="rectangular" width="3rem" height="1.5rem" />
          <Skeleton variant="rectangular" width="4rem" height="1.5rem" />
        </div>
        <div className="flex gap-1">
          <Skeleton variant="rectangular" width="2rem" height="1.5rem" />
          <Skeleton variant="rectangular" width="2.5rem" height="1.5rem" />
          <Skeleton variant="rectangular" width="2rem" height="1.5rem" />
        </div>
        <div className="flex items-center justify-between pt-3 border-t">
          <Skeleton variant="rectangular" width="3rem" height="1rem" />
          <Skeleton variant="rectangular" width="4rem" height="2rem" />
        </div>
      </div>
    </div>
  );
}
