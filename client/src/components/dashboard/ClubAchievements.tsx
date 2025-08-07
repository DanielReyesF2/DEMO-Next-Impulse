export const ClubAchievements = () => {
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-100 rounded-xl p-6">
      <h3 className="font-anton text-lg text-gray-800 mb-4 uppercase tracking-wide">
        Certificaciones Ambientales
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center bg-white p-3 rounded-lg">
          <span className="text-sm font-medium text-gray-700">TRUE Zero Waste</span>
          <span className="text-sm font-bold text-green-600">En progreso</span>
        </div>
        <div className="flex justify-between items-center bg-white p-3 rounded-lg">
          <span className="text-sm font-medium text-gray-700">ISO 14001</span>
          <span className="text-sm font-bold text-blue-600">Dic 2025</span>
        </div>
        <div className="flex justify-between items-center bg-white p-3 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Economía Circular</span>
          <span className="text-sm font-bold text-purple-600">Meta 2026</span>
        </div>
      </div>
    </div>
  );
};