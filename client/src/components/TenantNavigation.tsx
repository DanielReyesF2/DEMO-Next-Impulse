import { Link, useLocation } from "wouter";
import { 
  Home,
  Leaf, 
  Zap, 
  Droplets, 
  Recycle,
  Calendar,
  FileText,
  BarChart3,
  Upload,
  Download,
  Menu,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TenantNavigationProps {
  clientSlug: string;
}

export default function TenantNavigation({ clientSlug }: TenantNavigationProps) {
  const [location] = useLocation();

  const clientConfig = {
    'cccm': {
      name: 'CCCM',
      fullName: 'Club Campestre Ciudad de México',
      primaryColor: '#273949',
      secondaryColor: '#b5e951'
    },
    'club-de-golf-avandaro': {
      name: 'Avándaro Golf',
      fullName: 'Club de Golf Avándaro',
      primaryColor: '#0f4a3e',
      secondaryColor: '#7dd87d'
    },
    'rancho-avandaro': {
      name: 'Rancho Avándaro',
      fullName: 'Rancho Avándaro',
      primaryColor: '#4a3e0f',
      secondaryColor: '#e6d87d'
    }
  }[clientSlug] || {
    name: 'Cliente',
    fullName: 'Cliente Desconocido',
    primaryColor: '#273949',
    secondaryColor: '#b5e951'
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      icon: Home,
      path: `/${clientSlug}/dashboard`,
      description: 'Panel principal'
    },
    {
      name: 'Residuos',
      icon: Leaf,
      path: `/${clientSlug}/registro-diario`,
      description: 'Gestión de residuos',
      submenu: [
        { name: 'Registro Diario', path: `/${clientSlug}/registro-diario` },
        { name: 'Historial Mensual', path: `/${clientSlug}/historial-mensual` },
        { name: 'Trazabilidad', path: `/${clientSlug}/trazabilidad-residuos` }
      ]
    },
    {
      name: 'Energía',
      icon: Zap,
      path: `/${clientSlug}/energia`,
      description: 'Monitoreo energético'
    },
    {
      name: 'Agua',
      icon: Droplets,
      path: `/${clientSlug}/agua`,
      description: 'Gestión hídrica'
    },
    {
      name: 'Economía Circular',
      icon: Recycle,
      path: `/${clientSlug}/economia-circular`,
      description: 'Índice sustentabilidad'
    }
  ];

  const utilityItems = [
    {
      name: 'Documentos',
      icon: FileText,
      path: `/${clientSlug}/documents`
    },
    {
      name: 'Análisis',
      icon: BarChart3,
      path: `/${clientSlug}/analysis`
    },
    {
      name: 'Exportar',
      icon: Download,
      path: `/${clientSlug}/export`
    }
  ];

  const isActive = (path: string) => location === path;

  return (
    <div 
      className="bg-white shadow-sm border-b-2"
      style={{ borderBottomColor: clientConfig.primaryColor }}
    >
      {/* Top Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Back to client selector */}
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cambiar Cliente
              </Button>
            </Link>
            
            {/* Client Info */}
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: clientConfig.primaryColor }}
              >
                {clientConfig.name.charAt(0)}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{clientConfig.fullName}</h2>
                <Badge 
                  variant="secondary" 
                  className="text-xs"
                  style={{ 
                    backgroundColor: `${clientConfig.secondaryColor}20`,
                    color: clientConfig.primaryColor 
                  }}
                >
                  /{clientSlug}
                </Badge>
              </div>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="px-4 py-2">
        <nav className="flex items-center space-x-1">
          {/* Main Navigation */}
          {navigationItems.map((item) => {
            const isCurrentActive = isActive(item.path);
            return (
              <Link key={item.name} href={item.path}>
                <Button 
                  variant={isCurrentActive ? "default" : "ghost"}
                  size="sm"
                  className={`flex items-center space-x-2 ${
                    isCurrentActive 
                      ? 'text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  style={isCurrentActive ? { 
                    backgroundColor: clientConfig.primaryColor,
                    borderColor: clientConfig.primaryColor 
                  } : {}}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.name}</span>
                </Button>
              </Link>
            );
          })}

          {/* Separator */}
          <div className="w-px h-6 bg-gray-200 mx-2" />

          {/* Utility Items */}
          {utilityItems.map((item) => {
            const isCurrentActive = isActive(item.path);
            return (
              <Link key={item.name} href={item.path}>
                <Button 
                  variant="ghost"
                  size="sm"
                  className={`flex items-center space-x-2 ${
                    isCurrentActive 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden md:inline text-xs">{item.name}</span>
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Breadcrumb for current location */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center text-sm text-gray-600">
          <span>{clientConfig.name}</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">
            {navigationItems.find(item => isActive(item.path))?.name || 'Página'}
          </span>
        </div>
      </div>
    </div>
  );
}