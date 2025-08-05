import { cva, type VariantProps } from "class-variance-authority";
import { TrendingUp, TrendingDown, Scale, Trash2, BarChart, AlertTriangle } from "lucide-react";

const cardVariants = cva(
  "bg-white shadow rounded-lg p-5", {
    variants: {
      type: {
        organic: "organic-card",
        inorganic: "inorganic-card",
        total: "total-card",
        deviation: "deviation-card"
      }
    },
    defaultVariants: {
      type: "organic"
    }
  }
);

interface SummaryCardProps extends VariantProps<typeof cardVariants> {
  title: string;
  value: string;
  change: number;
  progress: number;
  progressLabel: string;
  type: "organic" | "inorganic" | "total" | "deviation";
}

export default function SummaryCard({
  title,
  value,
  change,
  progress,
  progressLabel,
  type
}: SummaryCardProps) {
  // Determine icon and colors based on card type
  const getConfig = () => {
    switch (type) {
      case "organic":
        return { 
          icon: Scale, 
          iconColor: "text-lime", 
          bgColor: "bg-lime/10",
          progressColor: "bg-lime"
        };
      case "inorganic":
        return { 
          icon: Trash2, 
          iconColor: "text-navy", 
          bgColor: "bg-navy/10",
          progressColor: "bg-navy"
        };
      case "total":
        return { 
          icon: BarChart, 
          iconColor: "text-gray-600", 
          bgColor: "bg-gray-100",
          progressColor: "bg-gray-600"
        };
      case "deviation":
        return { 
          icon: AlertTriangle, 
          iconColor: "text-orange-500", 
          bgColor: "bg-orange-50",
          progressColor: "bg-orange-500"
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-gray-900">{value}</span>
            <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change}%
            </span>
          </div>
        </div>
        <div className={`p-2 rounded-lg ${config.bgColor}`}>
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
        </div>
      </div>
      
      <div className="mt-4">
        <div className="w-full bg-gray-100 rounded-full h-1">
          <div 
            className={`${config.progressColor} h-1 rounded-full transition-all`} 
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">{progressLabel}</p>
      </div>
    </div>
  );
}
