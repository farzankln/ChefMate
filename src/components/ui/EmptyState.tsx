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
  features,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`text-center py-16 ${className}`}>
      <div className="max-w-md mx-auto">
        {/* Icon */}
        {icon && (
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-liner-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
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
            onClick={action.onClick}
            className="inline-flex items-center gap-3 px-8 py-4 bg-liner-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {action.icon && <span className="w-5 h-5">{action.icon}</span>}
            {action.label}
          </button>
        )}

        {/* Features list */}
        {features && features.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 text-sm text-gray-500">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center p-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                  <span className="w-5 h-5 text-gray-600">{feature.icon}</span>
                </div>
                <span className="font-medium">{feature.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
