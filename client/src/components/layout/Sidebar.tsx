import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Package,
  GitBranch,
  MapPin,
  BarChart3,
  FileText,
  LogOut
} from "lucide-react";
import { CURRENT_CLIENT } from "@/data/mockLots";

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive: boolean;
}

const SidebarItem = ({ to, icon, children, isActive }: SidebarItemProps) => {
  return (
    <Link href={to} className={`flex items-center px-6 py-3 ${
      isActive 
        ? "text-white bg-green-600" 
        : "text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
    }`}>
      <span className="mr-3">{icon}</span>
      <span>{children}</span>
    </Link>
  );
};

export default function Sidebar() {
  const [location] = useLocation();
  
  return (
    <div className="flex flex-col w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white h-screen">
      {/* Brand Section */}
      <div className="flex items-center justify-center h-24 px-4 border-b border-gray-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">NEXT IMPULSE</div>
          <div className="text-xs text-gray-400 uppercase tracking-widest">Green Traceability</div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 pt-4 pb-4 overflow-y-auto">
        <SidebarItem 
          to="/" 
          icon={<LayoutDashboard className="w-5 h-5" />} 
          isActive={location === "/" || location === "/dashboard"}
        >
          Mi Dashboard
        </SidebarItem>
        
        <SidebarItem 
          to="/lotes" 
          icon={<Package className="w-5 h-5" />} 
          isActive={location === "/lotes"}
        >
          Mis Lotes
        </SidebarItem>
        
        <div className="px-4 py-2 mt-4 text-xs uppercase tracking-wider text-gray-500">Mis Flujos Circulares</div>
        <SidebarItem 
          to="/lots/graficos-exhibidores" 
          icon={<GitBranch className="w-5 h-5" />} 
          isActive={location === "/lots/graficos-exhibidores"}
        >
          Gráficos → Exhibidores
        </SidebarItem>
        <SidebarItem 
          to="/lots/exhibidores-exhibidores" 
          icon={<GitBranch className="w-5 h-5" />} 
          isActive={location === "/lots/exhibidores-exhibidores"}
        >
          Exhibidores → Exhibidores
        </SidebarItem>
        <SidebarItem 
          to="/lots/graficos-graficos" 
          icon={<GitBranch className="w-5 h-5" />} 
          isActive={location === "/lots/graficos-graficos"}
        >
          Gráficos → Gráficos
        </SidebarItem>
        
        <div className="px-4 py-2 mt-4 text-xs uppercase tracking-wider text-gray-500">Análisis</div>
        <SidebarItem 
          to="/tracking" 
          icon={<MapPin className="w-5 h-5" />} 
          isActive={location === "/tracking"}
        >
          Mi Tracking
        </SidebarItem>
        <SidebarItem 
          to="/analytics" 
          icon={<BarChart3 className="w-5 h-5" />} 
          isActive={location === "/analytics"}
        >
          Mi Impacto
        </SidebarItem>
        <SidebarItem 
          to="/reportes" 
          icon={<FileText className="w-5 h-5" />} 
          isActive={location === "/reportes"}
        >
          Mis Reportes
        </SidebarItem>
      </nav>
      
      {/* User profile */}
      <div className="border-t border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{CURRENT_CLIENT.name}</p>
            <p className="text-xs text-gray-400">{CURRENT_CLIENT.type}</p>
          </div>
          <button className="text-gray-400 hover:text-white">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
