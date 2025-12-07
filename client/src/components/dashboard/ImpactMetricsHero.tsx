import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ImpactMetricsHeroProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "green" | "blue" | "orange" | "purple";
}

const colorClasses = {
  green: {
    bg: "bg-gradient-to-br from-green-50 to-emerald-50",
    icon: "bg-gradient-to-br from-green-500 to-emerald-600",
    text: "text-green-600",
    border: "border-green-200"
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-50 to-cyan-50",
    icon: "bg-gradient-to-br from-blue-500 to-cyan-600",
    text: "text-blue-600",
    border: "border-blue-200"
  },
  orange: {
    bg: "bg-gradient-to-br from-orange-50 to-red-50",
    icon: "bg-gradient-to-br from-orange-500 to-red-600",
    text: "text-orange-600",
    border: "border-orange-200"
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-50 to-indigo-50",
    icon: "bg-gradient-to-br from-purple-500 to-indigo-600",
    text: "text-purple-600",
    border: "border-purple-200"
  }
};

export function ImpactMetricsHero({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = "green"
}: ImpactMetricsHeroProps) {
  const colors = colorClasses[color];
  
  return (
    <div className={`rounded-2xl p-8 border-2 ${colors.border} ${colors.bg} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
            {title}
          </div>
        </div>
        <div className={`w-16 h-16 rounded-2xl ${colors.icon} flex items-center justify-center shadow-lg`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
      </div>
      
      <div className={`text-5xl font-black ${colors.text} mb-2 leading-none`}>
        {value}
      </div>
      
      {subtitle && (
        <div className="text-sm text-gray-600 mb-3">
          {subtitle}
        </div>
      )}
      
      {trend && (
        <div className="flex items-center space-x-1 mt-4">
          {trend.isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-600" />
          )}
          <span className={`text-sm font-semibold ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.value > 0 ? '+' : ''}{trend.value}%
          </span>
          <span className="text-sm text-gray-500">vs mes anterior</span>
        </div>
      )}
    </div>
  );
}

