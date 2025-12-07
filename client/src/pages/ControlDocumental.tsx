import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { 
  clientDocuments, 
  getDocumentStats, 
  calculateDocumentStatus,
  Document,
  DocumentCategory
} from '@/data/mockDocuments';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Search,
  Download,
  Eye,
  Shield,
  Truck,
  Recycle,
  Award,
  Settings,
  Calendar,
  Clock,
  FileText
} from 'lucide-react';

export default function ControlDocumental() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<DocumentCategory | 'all'>('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const stats = getDocumentStats();

  const filteredDocuments = clientDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    const statusA = calculateDocumentStatus(a.expirationDate);
    const statusB = calculateDocumentStatus(b.expirationDate);
    return statusA.daysRemaining - statusB.daysRemaining;
  });

  const getCategoryIcon = (category: DocumentCategory) => {
    const icons = {
      ambiental: <Shield className="w-4 h-4" />,
      transporte: <Truck className="w-4 h-4" />,
      reciclaje: <Recycle className="w-4 h-4" />,
      calidad: <Award className="w-4 h-4" />,
      operacion: <Settings className="w-4 h-4" />,
    };
    return icons[category];
  };

  const getCategoryColor = (category: DocumentCategory) => {
    const colors = {
      ambiental: 'bg-green-100 text-green-700',
      transporte: 'bg-blue-100 text-blue-700',
      reciclaje: 'bg-emerald-100 text-emerald-700',
      calidad: 'bg-purple-100 text-purple-700',
      operacion: 'bg-gray-100 text-gray-700',
    };
    return colors[category];
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <AppLayout>
      {/* Header con stats */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Control Documental</h1>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <span><strong className="text-gray-900">{stats.total}</strong> documentos</span>
            <span>•</span>
            <span className="flex items-center"><CheckCircle className="w-3 h-3 mr-1 text-emerald-500" /><strong className="text-emerald-600">{stats.vigentes}</strong> vigentes</span>
            <span>•</span>
            <span className="flex items-center"><AlertTriangle className="w-3 h-3 mr-1 text-amber-500" /><strong className="text-amber-600">{stats.porVencer}</strong> por vencer</span>
            <span>•</span>
            <span className="flex items-center"><XCircle className="w-3 h-3 mr-1 text-red-500" /><strong className="text-red-600">{stats.vencidos}</strong> vencidos</span>
          </div>
        </div>
      </div>

      {/* Alertas de próximos vencimientos */}
      {stats.proximosAVencer.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-amber-800 mb-2">Próximos Vencimientos</h3>
              <div className="grid grid-cols-2 gap-2">
                {stats.proximosAVencer.slice(0, 4).map(doc => {
                  const { daysRemaining } = calculateDocumentStatus(doc.expirationDate);
                  return (
                    <div 
                      key={doc.id} 
                      className="flex items-center justify-between bg-white rounded-lg p-2 cursor-pointer hover:bg-amber-100"
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 rounded flex items-center justify-center ${getCategoryColor(doc.category)}`}>
                          {getCategoryIcon(doc.category)}
                        </div>
                        <span className="text-sm text-gray-700 truncate max-w-[180px]">{doc.name}</span>
                      </div>
                      <span className={`text-xs font-medium ${daysRemaining <= 30 ? 'text-red-600' : 'text-amber-600'}`}>
                        {daysRemaining}d
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Filtros */}
            <div className="p-4 border-b border-gray-100 flex items-center space-x-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar documento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as DocumentCategory | 'all')}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="all">Todas</option>
                <option value="ambiental">Ambiental</option>
                <option value="transporte">Transporte</option>
                <option value="reciclaje">Reciclaje</option>
                <option value="calidad">Calidad</option>
                <option value="operacion">Operación</option>
              </select>
            </div>

            {/* Header de tabla */}
            <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
              <div className="col-span-5">Documento</div>
              <div className="col-span-2">Autoridad</div>
              <div className="col-span-2">Vence</div>
              <div className="col-span-2">Estado</div>
              <div className="col-span-1"></div>
            </div>

            {/* Lista de documentos */}
            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
              {filteredDocuments.map((doc) => {
                const { status, daysRemaining } = calculateDocumentStatus(doc.expirationDate);
                return (
                  <div 
                    key={doc.id}
                    className={`grid grid-cols-12 gap-2 px-4 py-3 hover:bg-gray-50 cursor-pointer items-center ${
                      selectedDocument?.id === doc.id ? 'bg-emerald-50' : ''
                    }`}
                    onClick={() => setSelectedDocument(doc)}
                  >
                    <div className="col-span-5 flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getCategoryColor(doc.category)}`}>
                        {getCategoryIcon(doc.category)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm truncate">{doc.name}</h4>
                        <p className="text-xs text-gray-400 font-mono">{doc.documentNumber}</p>
                      </div>
                    </div>
                    
                    <div className="col-span-2 text-xs text-gray-500 truncate">
                      {doc.issuingAuthority}
                    </div>
                    
                    <div className="col-span-2 text-xs text-gray-600">
                      {formatDate(doc.expirationDate)}
                    </div>
                    
                    <div className="col-span-2">
                      {status === 'vigente' && (
                        <span className="inline-flex items-center text-xs text-emerald-600">
                          <CheckCircle className="w-3 h-3 mr-1" />{daysRemaining}d
                        </span>
                      )}
                      {status === 'por_vencer' && (
                        <span className="inline-flex items-center text-xs text-amber-600 font-medium">
                          <AlertTriangle className="w-3 h-3 mr-1" />{daysRemaining}d
                        </span>
                      )}
                      {status === 'vencido' && (
                        <span className="inline-flex items-center text-xs text-red-600">
                          <XCircle className="w-3 h-3 mr-1" />Vencido
                        </span>
                      )}
                    </div>
                    
                    <div className="col-span-1 text-right">
                      <button className="p-1 text-gray-400 hover:text-emerald-600">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detalle */}
        <div className="lg:col-span-1">
          {selectedDocument ? (
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-6">
              {/* Header con estado */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(selectedDocument.category)}`}>
                  {getCategoryIcon(selectedDocument.category)}
                </div>
                {(() => {
                  const { status, daysRemaining } = calculateDocumentStatus(selectedDocument.expirationDate);
                  if (status === 'vigente') return <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full">{daysRemaining}d restantes</span>;
                  if (status === 'por_vencer') return <span className="px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded-full font-medium">{daysRemaining}d - Renovar</span>;
                  return <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">Vencido</span>;
                })()}
              </div>

              <h3 className="font-medium text-gray-900 mb-1">{selectedDocument.name}</h3>
              <p className="text-xs text-gray-400 font-mono mb-4">{selectedDocument.documentNumber}</p>
              
              <div className="space-y-3 text-sm border-t border-gray-100 pt-4">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{selectedDocument.issuingAuthority}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Emitido: {formatDate(selectedDocument.issueDate)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Vence: {formatDate(selectedDocument.expirationDate)}</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4 p-3 bg-gray-50 rounded-lg leading-relaxed">
                {selectedDocument.description}
              </p>

              {/* Historial de renovaciones */}
              {selectedDocument.renewalHistory && selectedDocument.renewalHistory.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-medium text-gray-500 mb-2">Historial</h4>
                  <div className="space-y-1">
                    {selectedDocument.renewalHistory.slice(0, 3).map((renewal, idx) => (
                      <div key={idx} className="text-xs text-gray-400">
                        {formatDate(renewal.date)} - {renewal.action}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 flex space-x-2">
                <button className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                  <Eye className="w-4 h-4 mr-1" />Ver
                </button>
                <button className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-white bg-emerald-500 rounded-lg hover:bg-emerald-600">
                  <Download className="w-4 h-4 mr-1" />PDF
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <div className="text-gray-400 text-sm">Selecciona un documento</div>
            </div>
          )}

          {/* Resumen por categoría */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Por Categoría</h3>
            <div className="space-y-2">
              {(['ambiental', 'transporte', 'reciclaje', 'calidad', 'operacion'] as DocumentCategory[]).map(cat => {
                const count = clientDocuments.filter(d => d.category === cat).length;
                const vigentes = clientDocuments.filter(d => d.category === cat && calculateDocumentStatus(d.expirationDate).status === 'vigente').length;
                return (
                  <div key={cat} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-6 h-6 rounded flex items-center justify-center ${getCategoryColor(cat)}`}>
                        {getCategoryIcon(cat)}
                      </div>
                      <span className="text-sm text-gray-600 capitalize">{cat}</span>
                    </div>
                    <span className="text-sm">
                      <span className="text-emerald-600 font-medium">{vigentes}</span>
                      <span className="text-gray-400">/{count}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
