import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  features?: Array<{
    icon: ReactNode;
    label: string;
  }>;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`text-center py-16 max-w-md mx-auto ${className}`}>
      {/* Icon */}
      {icon && (
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            {icon}
          </div>
        </div>
      )}

      {/* Content */}
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>

      {description && (
        <p className="text-gray-600 mb-8 leading-relaxed">{description}</p>
      )}

      {/* Action Button */}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="inline-flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {action.icon && <span className="w-5 h-5">{action.icon}</span>}
          {action.label}
        </button>
      )}
    </div>
  );
}
