import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CleanStatCardProps {
  title: string;
  value: string | number;
  helper?: string;
  emphasis?: "normal" | "positive";
  icon?: ReactNode;
}

export function CleanStatCard({
  title,
  value,
  helper,
  emphasis = "normal",
  icon,
}: CleanStatCardProps) {
  const valueColor =
    emphasis === "positive" ? "text-green-600" : "text-gray-900";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex items-start gap-4">
      {icon && (
        <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
          {icon}
        </div>
      )}
      <div className="flex-1">
        <p className="text-sm text-gray-500">{title}</p>
        <div className={cn("text-2xl font-bold mt-1", valueColor)}>{value}</div>
        {helper && <p className="text-xs text-gray-500 mt-1">{helper}</p>}
      </div>
    </div>
  );
}

