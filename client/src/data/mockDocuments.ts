// Modelo de datos para Control Documental
// Permisos, certificaciones y autorizaciones de Next Impulse Green

export type DocumentStatus = 'vigente' | 'por_vencer' | 'vencido' | 'en_tramite';
export type DocumentType = 'permiso' | 'certificacion' | 'autorizacion' | 'registro' | 'licencia';
export type DocumentCategory = 'ambiental' | 'transporte' | 'reciclaje' | 'calidad' | 'operacion';

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  category: DocumentCategory;
  issuingAuthority: string;
  issueDate: string;
  expirationDate: string;
  status: DocumentStatus;
  documentNumber: string;
  description: string;
  relatedTo: string;
  fileUrl?: string;
  lastVerified: string;
  renewalHistory?: {
    date: string;
    action: string;
    notes: string;
  }[];
}

// Calcular días restantes y estado
export function calculateDocumentStatus(expirationDate: string): { status: DocumentStatus; daysRemaining: number } {
  const today = new Date();
  const expDate = new Date(expirationDate);
  const diffTime = expDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (daysRemaining < 0) return { status: 'vencido', daysRemaining };
  if (daysRemaining <= 30) return { status: 'por_vencer', daysRemaining };
  return { status: 'vigente', daysRemaining };
}

// Documentos de Next Impulse Green para el cliente EGO
// Fechas ajustadas para demo (fecha actual: Diciembre 2025)
export const clientDocuments: Document[] = [
  // Permisos Ambientales
  {
    id: "DOC-001",
    name: "Licencia Ambiental Única (LAU)",
    type: "licencia",
    category: "ambiental",
    issuingAuthority: "SEMARNAT",
    issueDate: "2024-03-15",
    expirationDate: "2027-03-15",
    status: "vigente",
    documentNumber: "LAU-CDMX-2024-0847",
    description: "Licencia para operación de planta de reciclaje de plásticos y producción de exhibidores con material reciclado",
    relatedTo: "Planta de producción Next Impulse Green",
    lastVerified: "2025-11-15",
    renewalHistory: [
      { date: "2024-03-15", action: "Emisión inicial", notes: "Aprobada sin observaciones" },
      { date: "2025-03-10", action: "Verificación anual", notes: "Cumplimiento al 100%" }
    ]
  },
  {
    id: "DOC-002",
    name: "Registro como Generador de Residuos",
    type: "registro",
    category: "ambiental",
    issuingAuthority: "SEMARNAT",
    issueDate: "2023-06-01",
    expirationDate: "2026-06-01",
    status: "vigente",
    documentNumber: "RGR-CDMX-2023-1284",
    description: "Registro como generador de residuos de manejo especial para operaciones de reciclaje",
    relatedTo: "Gestión de residuos de producción",
    lastVerified: "2025-10-20",
    renewalHistory: [
      { date: "2023-06-01", action: "Registro inicial", notes: "Categoría: Gran generador" }
    ]
  },
  {
    id: "DOC-003",
    name: "Autorización de Impacto Ambiental",
    type: "autorizacion",
    category: "ambiental",
    issuingAuthority: "SEDEMA CDMX",
    issueDate: "2022-09-20",
    expirationDate: "2027-09-20",
    status: "vigente",
    documentNumber: "AIA-CDMX-2022-0392",
    description: "Autorización de impacto ambiental para planta de procesamiento de materiales reciclados",
    relatedTo: "Operaciones de planta",
    lastVerified: "2025-09-15"
  },

  // Certificaciones de Reciclaje - PRÓXIMAS A VENCER
  {
    id: "DOC-004",
    name: "Certificación de Contenido Reciclado",
    type: "certificacion",
    category: "reciclaje",
    issuingAuthority: "SCS Global Services",
    issueDate: "2025-01-15",
    expirationDate: "2026-01-15",
    status: "por_vencer",
    documentNumber: "SCS-RCC-2025-MX-0128",
    description: "Certificación que avala el 60%+ de contenido reciclado post-consumo en exhibidores 4R PLANET",
    relatedTo: "Línea de productos 4R PLANET",
    lastVerified: "2025-11-01",
    renewalHistory: [
      { date: "2025-01-15", action: "Renovación anual", notes: "Verificado 62% contenido reciclado" },
      { date: "2024-01-20", action: "Certificación inicial", notes: "Primera certificación SCS" }
    ]
  },
  {
    id: "DOC-005",
    name: "Certificación de Cadena de Custodia",
    type: "certificacion",
    category: "reciclaje",
    issuingAuthority: "SCS Global Services",
    issueDate: "2025-02-01",
    expirationDate: "2026-02-01",
    status: "vigente",
    documentNumber: "SCS-COC-2025-MX-0089",
    description: "Certificación de trazabilidad de materiales reciclados desde origen hasta producto final",
    relatedTo: "Cadena de suministro de materiales reciclados",
    lastVerified: "2025-10-15"
  },
  {
    id: "DOC-006",
    name: "Certificación ISO 14001:2015",
    type: "certificacion",
    category: "ambiental",
    issuingAuthority: "Bureau Veritas",
    issueDate: "2024-05-10",
    expirationDate: "2027-05-10",
    status: "vigente",
    documentNumber: "BV-ISO14001-MX-2024-0547",
    description: "Sistema de Gestión Ambiental certificado bajo norma ISO 14001:2015",
    relatedTo: "Sistema de gestión ambiental",
    lastVerified: "2025-05-08",
    renewalHistory: [
      { date: "2025-05-08", action: "Auditoría de seguimiento", notes: "0 no conformidades" },
      { date: "2024-05-10", action: "Certificación inicial", notes: "Alcance: Diseño, producción y reciclaje de exhibidores" }
    ]
  },

  // Autorizaciones de Transporte
  {
    id: "DOC-007",
    name: "Autorización de Transporte de Residuos",
    type: "autorizacion",
    category: "transporte",
    issuingAuthority: "SCT / SEMARNAT",
    issueDate: "2025-03-01",
    expirationDate: "2026-03-01",
    status: "vigente",
    documentNumber: "ATR-SCT-2025-CDMX-0234",
    description: "Autorización para transporte de materiales plásticos para reciclaje (no peligrosos)",
    relatedTo: "Recolección de gráficos usados",
    lastVerified: "2025-11-10"
  },
  {
    id: "DOC-008",
    name: "Póliza de Seguro Ambiental",
    type: "permiso",
    category: "transporte",
    issuingAuthority: "AXA Seguros",
    issueDate: "2025-01-01",
    expirationDate: "2025-12-31",
    status: "por_vencer",
    documentNumber: "POL-AMB-2025-NIG-001",
    description: "Póliza de seguro de responsabilidad civil ambiental para operaciones de transporte y procesamiento",
    relatedTo: "Cobertura de operaciones",
    lastVerified: "2025-11-01"
  },

  // Certificaciones de Calidad
  {
    id: "DOC-009",
    name: "Certificación ISO 9001:2015",
    type: "certificacion",
    category: "calidad",
    issuingAuthority: "Bureau Veritas",
    issueDate: "2023-08-15",
    expirationDate: "2026-08-15",
    status: "vigente",
    documentNumber: "BV-ISO9001-MX-2023-0891",
    description: "Sistema de Gestión de Calidad certificado bajo norma ISO 9001:2015",
    relatedTo: "Producción de exhibidores 4R PLANET",
    lastVerified: "2025-08-10",
    renewalHistory: [
      { date: "2025-08-10", action: "Auditoría de seguimiento", notes: "1 observación menor cerrada" },
      { date: "2024-08-12", action: "Auditoría de seguimiento", notes: "Sin hallazgos" }
    ]
  },

  // Registros Operativos
  {
    id: "DOC-010",
    name: "Registro ante RETC",
    type: "registro",
    category: "ambiental",
    issuingAuthority: "SEMARNAT",
    issueDate: "2023-01-15",
    expirationDate: "2028-01-15",
    status: "vigente",
    documentNumber: "RETC-2023-CDMX-0456",
    description: "Registro de Emisiones y Transferencia de Contaminantes",
    relatedTo: "Reporte anual de emisiones",
    lastVerified: "2025-06-30"
  },
  {
    id: "DOC-011",
    name: "Certificado de Industria Limpia",
    type: "certificacion",
    category: "ambiental",
    issuingAuthority: "PROFEPA",
    issueDate: "2024-11-20",
    expirationDate: "2026-11-20",
    status: "vigente",
    documentNumber: "CIL-PROFEPA-2024-0789",
    description: "Certificado de Industria Limpia Nivel 2 - Cumplimiento ambiental verificado",
    relatedTo: "Operaciones generales de planta",
    lastVerified: "2025-11-15",
    renewalHistory: [
      { date: "2024-11-20", action: "Certificación Nivel 2", notes: "Ascenso desde Nivel 1" },
      { date: "2022-11-15", action: "Certificación Nivel 1", notes: "Primera certificación" }
    ]
  },

  // Documento próximo a vencer para demo
  {
    id: "DOC-012",
    name: "Permiso de Uso de Suelo Industrial",
    type: "permiso",
    category: "operacion",
    issuingAuthority: "Alcaldía Azcapotzalco",
    issueDate: "2023-12-01",
    expirationDate: "2025-12-15",
    status: "por_vencer",
    documentNumber: "USI-AZC-2023-1847",
    description: "Permiso de uso de suelo para actividades industriales de reciclaje y manufactura",
    relatedTo: "Instalaciones de planta",
    lastVerified: "2025-11-01"
  }
];

// Estadísticas de documentos
export function getDocumentStats() {
  const stats = {
    total: clientDocuments.length,
    vigentes: 0,
    porVencer: 0,
    vencidos: 0,
    enTramite: 0,
    proximosAVencer: [] as Document[],
  };

  clientDocuments.forEach(doc => {
    const { status, daysRemaining } = calculateDocumentStatus(doc.expirationDate);
    
    switch (status) {
      case 'vigente':
        stats.vigentes++;
        break;
      case 'por_vencer':
        stats.porVencer++;
        stats.proximosAVencer.push({ ...doc, status });
        break;
      case 'vencido':
        stats.vencidos++;
        break;
      case 'en_tramite':
        stats.enTramite++;
        break;
    }
  });

  // Ordenar próximos a vencer por fecha
  stats.proximosAVencer.sort((a, b) => 
    new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime()
  );

  return stats;
}

// Obtener documento por ID
export function getDocumentById(id: string): Document | undefined {
  return clientDocuments.find(doc => doc.id === id);
}

// Filtrar documentos por categoría
export function getDocumentsByCategory(category: DocumentCategory): Document[] {
  return clientDocuments.filter(doc => doc.category === category);
}

// Filtrar documentos por tipo
export function getDocumentsByType(type: DocumentType): Document[] {
  return clientDocuments.filter(doc => doc.type === type);
}
