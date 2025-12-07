import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ExecutiveKPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
    direction: "up" | "down" | "neutral";
  };
  icon?: ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  className?: string;
  onClick?: () => void;
}

const variantStyles = {
  default: "border-gray-200 bg-white",
  primary: "border-blue-200 bg-blue-50",
  success: "border-green-200 bg-green-50",
  warning: "border-yellow-200 bg-yellow-50",
  danger: "border-red-200 bg-red-50",
};

const iconColors = {
  default: "text-gray-600",
  primary: "text-blue-600",
  success: "text-green-600",
  warning: "text-yellow-600",
  danger: "text-red-600",
};

export function ExecutiveKPICard({
  title,
  value,
  subtitle,
  trend,
  icon,
  variant = "default",
  className,
  onClick,
}: ExecutiveKPICardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === "number") {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      }
      if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    switch (trend.direction) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case "neutral":
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div
      className={cn(
        "rounded-lg border p-6 shadow-sm transition-all hover:shadow-md",
        variantStyles[variant],
        onClick && "cursor-pointer hover:border-gray-300",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {icon && (
              <div className={cn("p-2 rounded-md bg-white", iconColors[variant])}>
                {icon}
              </div>
            )}
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              {title}
            </h3>
          </div>
          
          <div className="mt-3">
            <div className="text-3xl font-bold text-gray-900">
              {formatValue(value)}
            </div>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          
          {trend && (
            <div className="flex items-center space-x-1 mt-3">
              {getTrendIcon()}
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.direction === "up" && "text-green-600",
                  trend.direction === "down" && "text-red-600",
                  trend.direction === "neutral" && "text-gray-600"
                )}
              >
                {trend.value > 0 ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-xs text-gray-500">{trend.label}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

