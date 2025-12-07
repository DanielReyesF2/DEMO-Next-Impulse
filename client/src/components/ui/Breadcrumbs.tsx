import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className="flex items-center text-sm text-gray-500 space-x-1">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div key={idx} className="flex items-center space-x-1">
            {item.href && !isLast ? (
              <Link href={item.href}>
                <a className="hover:text-gray-700">{item.label}</a>
              </Link>
            ) : (
              <span className={isLast ? "text-gray-700 font-medium" : ""}>{item.label}</span>
            )}
            {!isLast && <ChevronRight className="w-3 h-3 text-gray-400" />}
          </div>
        );
      })}
    </div>
  );
}

