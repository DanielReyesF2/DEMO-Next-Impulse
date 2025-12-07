import { Building2, Package, TrendingUp } from "lucide-react";

interface Client {
  name: string;
  logo: string;
  activeLots: number;
  totalCycles: number;
  color: string;
}

const clients: Client[] = [
  {
    name: "P&G",
    logo: "P&G",
    activeLots: 15,
    totalCycles: 89,
    color: "from-blue-500 to-blue-600"
  },
  {
    name: "Coca-Cola",
    logo: "COCA",
    activeLots: 12,
    totalCycles: 67,
    color: "from-red-500 to-red-600"
  },
  {
    name: "Boing",
    logo: "BOING",
    activeLots: 8,
    totalCycles: 43,
    color: "from-purple-500 to-purple-600"
  },
  {
    name: "Bokados",
    logo: "BOK",
    activeLots: 6,
    totalCycles: 28,
    color: "from-yellow-500 to-orange-600"
  },
  {
    name: "Henkel",
    logo: "HNK",
    activeLots: 7,
    totalCycles: 35,
    color: "from-green-500 to-emerald-600"
  }
];

export function ClientShowcase() {
  const totalActiveLots = clients.reduce((sum, client) => sum + client.activeLots, 0);
  
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <span>Clientes Destacados</span>
          </h3>
          <div className="text-sm text-gray-400">
            {totalActiveLots} lotes activos
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {clients.map((client) => (
            <div
              key={client.name}
              className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border-2 border-gray-200 hover:border-green-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            >
              <div className="text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${client.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                  <span className="text-white font-black text-sm">{client.logo}</span>
                </div>
                
                <div className="font-bold text-gray-900 mb-1">{client.name}</div>
                
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center justify-center space-x-1">
                    <Package className="w-3 h-3" />
                    <span>{client.activeLots} lotes</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{client.totalCycles} ciclos</span>
                  </div>
                </div>
              </div>
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">
            Ver todos los clientes →
          </button>
        </div>
      </div>
    </div>
  );
}

