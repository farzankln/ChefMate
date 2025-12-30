import { BaseSkeleton } from "./BaseSkeleton";

export function TextSkeleton({
  lines = 1,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <BaseSkeleton
          key={index}
          height="1rem"
          className={`${index === lines - 1 && lines > 1 ? "w-3/4" : "w-full"}`}
        />
      ))}
    </div>
  );
}

export function ImageSkeleton({ className = "" }: { className?: string }) {
  return <BaseSkeleton height="12rem" className={`rounded-lg ${className}`} />;
}

export function AvatarSkeleton({ className = "" }: { className?: string }) {
  return (
    <BaseSkeleton circle height="2.5rem" width="2.5rem" className={className} />
  );
}

export function BadgeSkeleton({ className = "" }: { className?: string }) {
  return (
    <BaseSkeleton
      height="1.5rem"
      width="4rem"
      className={`rounded-full ${className}`}
    />
  );
}

export function ButtonSkeleton({ className = "" }: { className?: string }) {
  return (
    <BaseSkeleton
      height="2.5rem"
      width="6rem"
      className={`rounded-lg ${className}`}
    />
  );
}

export function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}
    >
      <ImageSkeleton />
      <div className="p-4 space-y-3">
        <BaseSkeleton height="1.5rem" />
        <TextSkeleton lines={2} />
        <div className="flex gap-2">
          <BadgeSkeleton />
          <BadgeSkeleton />
        </div>
        <div className="flex gap-1">
          <BadgeSkeleton />
          <BadgeSkeleton />
          <BadgeSkeleton />
        </div>
        <div className="flex items-center justify-between pt-3 border-t">
          <BaseSkeleton height="1rem" width="3rem" />
          <ButtonSkeleton />
        </div>
      </div>
    </div>
  );
}
