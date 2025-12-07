import { Link, useLocation } from "wouter";
import { CURRENT_CLIENT } from "@/data/mockExhibitors";

const navTabs = [
  { path: "/", label: "Dashboard" },
  { path: "/exhibidores", label: "Mis Exhibidores" },
  { path: "/trazabilidad", label: "Trazabilidad" },
  { path: "/documentos", label: "Control Documental" },
  { path: "/reportes", label: "Reportes" },
];

export default function TopNavigation() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <svg viewBox="0 0 60 60" className="h-10 w-10">
              {/* X shape - gray outline */}
              <path d="M10 5 L25 30 L10 55 L18 55 L30 35 L42 55 L50 55 L35 30 L50 5 L42 5 L30 25 L18 5 Z" fill="#9CA3AF" />
              {/* Green accent - left part */}
              <path d="M15 8 L28 30 L15 52 L22 52 L30 38 L30 22 L22 8 Z" fill="#7CB342" />
            </svg>
            <span className="text-lg font-semibold text-gray-700">Next Impulse</span>
          </Link>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1">
            {navTabs.map((tab) => (
              <Link key={tab.path} href={tab.path}>
                <span
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

          {/* Right side: Demo Badge + Powered by */}
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">
              Demo
            </span>
            <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
              <span className="text-xs text-gray-500">Powered by</span>
              <img 
                src="/images/logo-econova.png" 
                alt="Econova" 
                className="h-5 w-auto"
                style={{ filter: 'invert(1) brightness(0.2)' }}
              />
              <span className="text-xs font-semibold text-gray-700">Econova</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
