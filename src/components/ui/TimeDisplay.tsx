import type { TimeDisplayProps } from "@/types/components";
import { FiClock } from "react-icons/fi";

export function TimeDisplay({
  time,
  label,
  icon,
  className = "",
}: TimeDisplayProps) {
  const formatTime = (timeString: string) => {
    if (timeString.includes("min")) return timeString;
    return `${timeString} min`;
  };

  return (
    <span
      className={`flex items-center gap-1 text-sm text-gray-500 ${className}`}
    >
      {icon || <FiClock className="w-3 h-3" />}
      {label && `${label}: `}
      {formatTime(time)}
    </span>
  );
}
