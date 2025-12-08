import { Link, useLocation } from "wouter";
import { useWalkthrough } from "@/components/walkthrough";
import { Play } from "lucide-react";

const navTabs = [
  { path: "/", label: "Dashboard", tourId: "nav-dashboard" },
  { path: "/trazabilidad", label: "Trazabilidad", tourId: "nav-trazabilidad" },
];

export default function TopNavigation() {
  const [location] = useLocation();
  const { openModal } = useWalkthrough();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Demo Badge */}
          <Link href="/" className="flex items-center space-x-2">
            <svg viewBox="0 0 60 60" className="h-10 w-10">
              {/* X shape - gray outline */}
              <path d="M10 5 L25 30 L10 55 L18 55 L30 35 L42 55 L50 55 L35 30 L50 5 L42 5 L30 25 L18 5 Z" fill="#9CA3AF" />
              {/* Green accent - left part */}
              <path d="M15 8 L28 30 L15 52 L22 52 L30 38 L30 22 L22 8 Z" fill="#7CB342" />
            </svg>
            <span className="px-2 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">
              Demo
            </span>
          </Link>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1">
            {navTabs.map((tab) => (
              <Link key={tab.path} href={tab.path}>
                <span
                  data-tour={tab.tourId}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                    isActive(tab.path)
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Right side: Demo Guiado + Powered by */}
          <div className="flex items-center gap-4">
            {/* Demo Guiado Button */}
            <button
              onClick={openModal}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all pulse-demo"
            >
              <Play className="w-4 h-4" />
              Demo Guiado
            </button>

            {/* Powered by */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-400">Powered by</span>
              <img 
                src="/images/logo-econova.png" 
                alt="Econova" 
                className="h-12 w-auto"
                style={{ filter: 'invert(1) brightness(0.2)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
