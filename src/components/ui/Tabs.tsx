"use client";

import { ReactNode, useState } from "react";

export interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: "default" | "pills" | "underline";
  className?: string;
  onTabChange?: (tabId: string) => void;
}

export function Tabs({
  tabs,
  defaultTab,
  variant = "default",
  className = "",
  onTabChange,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const currentTab = tabs.find((tab) => tab.id === activeTab);

  const baseNavClasses = "flex";
  const variantNavClasses = {
    default: "-mb-px border-b border-gray-200 bg-gray-50",
    pills: "space-x-1 bg-gray-100 p-1 rounded-lg",
    underline: "border-b border-gray-200",
  };

  const baseTabClasses =
    "inline-flex items-center gap-2 py-4 px-6 font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
  const variantTabClasses = {
    default: `border-b-2 ${
      activeTab
        ? "border-blue-600 text-blue-600 bg-white"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }`,
    pills: `rounded-md ${
      activeTab
        ? "bg-white text-blue-600 shadow-sm"
        : "text-gray-500 hover:text-gray-700"
    }`,
    underline: `border-b-2 ${
      activeTab
        ? "border-blue-600 text-blue-600"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }`,
  };

  const iconClasses = {
    default: activeTab
      ? "text-blue-600"
      : "text-gray-400 group-hover:text-gray-500",
    pills: activeTab ? "text-blue-600" : "text-gray-400",
    underline: activeTab
      ? "text-blue-600"
      : "text-gray-400 group-hover:text-gray-500",
  };

  return (
    <div className={className}>
      {/* Tab Navigation */}
      <nav
        className={`${baseNavClasses} ${variantNavClasses[variant]}`}
        aria-label="Tabs"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && handleTabChange(tab.id)}
              disabled={tab.disabled}
              className={`
                ${baseTabClasses} ${variantTabClasses[variant]}
                ${tab.disabled ? "opacity-50 cursor-not-allowed" : ""}
                ${isActive ? "" : ""}
              `}
              aria-current={isActive ? "page" : undefined}
              data-disabled={tab.disabled}
            >
              {tab.icon && (
                <span className={iconClasses[variant]}>{tab.icon}</span>
              )}
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Tab Content */}
      {currentTab && <div className="p-8">{currentTab.content}</div>}
    </div>
  );
}
