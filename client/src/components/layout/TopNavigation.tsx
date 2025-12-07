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
          <Link href="/" className="flex items-center space-x-3">
            <img 
              src="/images/logo-next-impulse.png" 
              alt="Next Impulse Green" 
              className="h-10 w-auto"
            />
            <span className="text-lg font-medium text-gray-700">Next Impulse Green</span>
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

          {/* Client Info */}
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">Cliente:</span>
            <span className="text-sm font-semibold text-gray-900">{CURRENT_CLIENT.company}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
