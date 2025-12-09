// Modelo de datos real de Next Impulse Green
// Exhibidores 4R PLANET + Ciclos de Gráficos

export interface Location {
  store: string;
  address: string;
  city: string;
}

export interface GraphicCycle {
  id: string;
  lotId: string; // ID de trazabilidad único: EXH-EGO-001-C01
  cycleNumber: number;
  campaign: string;
  client: string;
  brand: string;
  startDate: string;
  endDate: string | null;
  location: Location;
  recycledInto: 'exhibitor' | 'graphic' | null;
  // Conexiones de storytelling
  sourceFromLotId: string | null; // De dónde viene el material
  recycledToLotId: string | null; // A dónde va el material
  materialRecovered: number; // kg recuperados del ciclo anterior
  materialSent: number; // kg enviados al siguiente ciclo
  // Emisiones
  emissions: {
    transport: number;
    processing: number;
    total: number;
  };
  savingsVsVirgin: number; // kg CO2 ahorrados vs material virgen
  distance: number; // km recorridos
  weight: number; // kg del gráfico
}

export interface ProductionSpecs {
  orderNumber: string;
  material: string;
  weightPerUnit: number; // gramos
  totalUnits: number;
  totalPallets: number;
  injectionMachine: string;
  cycleTime: number; // segundos
  unitsPerHour: number;
  totalHDPE: number; // kg
  totalMasterBatch: number; // kg
}

export interface ProcessPhoto {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  weight?: string;
}

export interface Exhibitor {
  id: string;
  model: string;
  dimensions: string;
  location: Location;
  manufactureDate: string;
  yearsInOperation: number;
  currentGraphic: {
    campaign: string;
    installedDate: string;
    client: string;
    brand: string;
  };
  graphicChanges: number;
  graphicHistory: GraphicCycle[];
  condition: 'excellent' | 'good' | 'fair';
  status: 'active' | 'transit' | 'maintenance';
  recycledContent: number;
  capacityPerShelf: number;
  clientOwner: string;
  productionSpecs?: ProductionSpecs;
  processPhotos?: ProcessPhoto[];
}

export interface ClientData {
  company: string;
  industry: string;
  totalExhibitors: number;
  totalGraphicsRecycled: number;
  avgExhibitorAge: number;
  emissions: {
    generated: number;
    avoided: number;
    netBalance: number;
  };
  comparison: {
    traditionalEmissions: number;
    traditionalCost: number;
    traditionalWaste: number;
    circularEmissions: number;
    circularCost: number;
    circularWaste: number;
  };
  materials: {
    totalKg: number;
    recycledKg: number;
    virginKg: number;
  };
}

// Ubicaciones donde ha estado el exhibidor
const exhibitorLocations: Location[] = [
  { store: "Walmart Polanco", address: "Av. Ejército Nacional 843-B", city: "CDMX" },
  { store: "Walmart Santa Fe", address: "Vasco de Quiroga 3800", city: "CDMX" },
  { store: "Liverpool Perisur", address: "Anillo Periférico 4690", city: "CDMX" },
  { store: "Soriana Interlomas", address: "Blvd. Interlomas 5", city: "Huixquilucan" },
  { store: "OXXO Reforma", address: "Paseo de la Reforma 222", city: "CDMX" },
];

// Generar los 15 ciclos para EXH-EGO-001 (Jarritos) con storytelling
function generateCompleteGraphicHistory(exhibitorId: string): GraphicCycle[] {
  const cycles: GraphicCycle[] = [];
  
  // Definir los 15 ciclos específicos del exhibidor EXH-EGO-001
  const cycleData = [
    // Ciclo 1: Lanzamiento (Mar-May 2021)
    { campaign: "Lanzamiento 4R PLANET", start: "2021-03-15", end: "2021-05-31", location: 0, recycledInto: "graphic" as const },
    // Ciclo 2: Verano 2021 (Jun-Ago 2021)
    { campaign: "Verano EGO 2021", start: "2021-06-01", end: "2021-08-15", location: 0, recycledInto: "exhibitor" as const },
    // Ciclo 3: Back to School 2021 (Ago-Oct 2021)
    { campaign: "Back to School 2021", start: "2021-08-16", end: "2021-10-31", location: 1, recycledInto: "graphic" as const },
    // Ciclo 4: Navidad 2021 (Nov-Dic 2021)
    { campaign: "Navidad EGO 2021", start: "2021-11-01", end: "2021-12-31", location: 1, recycledInto: "exhibitor" as const },
    // Ciclo 5: Año Nuevo 2022 (Ene-Mar 2022)
    { campaign: "Año Nuevo EGO 2022", start: "2022-01-01", end: "2022-03-15", location: 1, recycledInto: "graphic" as const },
    // Ciclo 6: Primavera 2022 (Mar-May 2022)
    { campaign: "Primavera EGO 2022", start: "2022-03-16", end: "2022-05-31", location: 2, recycledInto: "graphic" as const },
    // Ciclo 7: Verano 2022 (Jun-Ago 2022)
    { campaign: "Verano EGO 2022", start: "2022-06-01", end: "2022-08-15", location: 2, recycledInto: "exhibitor" as const },
    // Ciclo 8: Back to School 2022 (Ago-Oct 2022)
    { campaign: "Back to School 2022", start: "2022-08-16", end: "2022-10-31", location: 0, recycledInto: "graphic" as const },
    // Ciclo 9: Navidad 2022 (Nov-Dic 2022)
    { campaign: "Navidad EGO 2022", start: "2022-11-01", end: "2022-12-31", location: 0, recycledInto: "graphic" as const },
    // Ciclo 10: Primavera 2023 (Mar-May 2023)
    { campaign: "Primavera EGO 2023", start: "2023-03-01", end: "2023-05-31", location: 0, recycledInto: "exhibitor" as const },
    // Ciclo 11: Verano 2023 (Jun-Ago 2023)
    { campaign: "Verano EGO 2023", start: "2023-06-01", end: "2023-08-15", location: 3, recycledInto: "graphic" as const },
    // Ciclo 12: Back to School 2023 (Ago-Oct 2023)
    { campaign: "Back to School 2023", start: "2023-08-16", end: "2023-10-31", location: 3, recycledInto: "graphic" as const },
    // Ciclo 13: Navidad 2023 (Nov-Dic 2023)
    { campaign: "Navidad EGO 2023", start: "2023-11-01", end: "2023-12-31", location: 0, recycledInto: "exhibitor" as const },
    // Ciclo 14: Primavera 2024 (Mar-Oct 2024)
    { campaign: "Primavera EGO 2024", start: "2024-03-01", end: "2024-10-31", location: 0, recycledInto: "graphic" as const },
    // Ciclo 15: Jarritos 2025 (Dic 2024 - Actual)
    { campaign: "Jarritos 2025", start: "2024-12-01", end: null, location: 0, recycledInto: null },
  ];

  // Primera pasada: crear ciclos base
  cycleData.forEach((data, index) => {
    const cycleNumber = index + 1;
    const distance = 15 + Math.floor(Math.random() * 30);
    // Peso promedio de ~100kg por ciclo (rango 85-115 kg)
    const weight = 85 + Math.random() * 30;
    const transportEmissions = distance * 0.12; // Factor ajustado para mayor peso
    const processingEmissions = data.recycledInto ? weight * 0.08 : 0;
    
    // ID de trazabilidad único
    const lotId = `${exhibitorId}-C${String(cycleNumber).padStart(2, '0')}`;
    
    // Material recuperado del ciclo anterior (merma eficiente de ~1.5%)
    const materialRecovered = cycleNumber === 1 ? 0 : Number((weight * 0.985).toFixed(1));
    
    // Material enviado al siguiente ciclo (merma eficiente de ~1.5%)
    const materialSent = data.recycledInto ? Number((weight * 0.985).toFixed(1)) : 0;
    
    // Ahorro vs material virgen (3.5 kg CO2 por kg de plástico virgen)
    const savingsVsVirgin = Number((materialRecovered * 3.5).toFixed(1));
    
    cycles.push({
      id: `GFX-001-${String(cycleNumber).padStart(3, '0')}`,
      lotId,
      cycleNumber,
      campaign: data.campaign,
      client: "EGO",
      brand: "EGO",
      startDate: data.start,
      endDate: data.end,
      location: exhibitorLocations[data.location],
      recycledInto: data.recycledInto,
      sourceFromLotId: cycleNumber === 1 ? null : `${exhibitorId}-C${String(cycleNumber - 1).padStart(2, '0')}`,
      recycledToLotId: data.recycledInto ? `${exhibitorId}-C${String(cycleNumber + 1).padStart(2, '0')}` : null,
      materialRecovered,
      materialSent,
      emissions: {
        transport: Number(transportEmissions.toFixed(2)),
        processing: Number(processingEmissions.toFixed(2)),
        total: Number((transportEmissions + processingEmissions).toFixed(2)),
      },
      savingsVsVirgin,
      distance,
      weight: Number(weight.toFixed(2)),
    });
  });

  return cycles;
}

// Cliente actual del portal
// Total ciclos: 15 + 7 + 5 + 3 = 30 ciclos
export const CURRENT_CLIENT: ClientData = {
  company: "EGO",
  industry: "Consumo / Cuidado Personal",
  totalExhibitors: 4,
  totalGraphicsRecycled: 30,
  avgExhibitorAge: 2.8,
  emissions: {
    generated: 18.5,
    avoided: 165.0,
    netBalance: -146.5,
  },
  comparison: {
    traditionalEmissions: 540,
    traditionalCost: 78000,
    traditionalWaste: 165,
    circularEmissions: 18.5,
    circularCost: 18000,
    circularWaste: 0,
  },
  materials: {
    totalKg: 165,
    recycledKg: 140,
    virginKg: 25,
  }
};

// Modelos de exhibidores 4R PLANET
export const exhibitorModels = [
  { id: 'estandar', name: '4R PLANET Estándar', dimensions: '41cm x 41cm' },
  { id: 'rectangular', name: '4R PLANET Rectangular', dimensions: '41cm x 32cm' },
  { id: 'tortillero', name: '4R PLANET Tortillero', dimensions: '2 charolas por nivel' },
  { id: 'isla', name: '4R PLANET Isla', dimensions: '82cm x 82cm' },
  { id: 'isla-mega', name: '4R PLANET Isla Mega', dimensions: '164cm x 82cm' },
  { id: 'trailer', name: '4R PLANET Trailer', dimensions: 'Temático' },
  { id: 'trailer-mega', name: '4R PLANET Trailer Mega', dimensions: 'Temático Grande' },
  { id: 'arco', name: '4R PLANET Arco', dimensions: 'Estructura Arco' },
];

// Generar historial completo para EXH-EGO-001
const exh001GraphicHistory = generateCompleteGraphicHistory("EXH-EGO-001");

// Función para generar historial de gráficos para otros exhibidores
function generateGraphicHistoryForExhibitor(exhibitorId: string, cycles: number, startDate: string): GraphicCycle[] {
  const history: GraphicCycle[] = [];
  const campaigns = [
    "Año Nuevo", "Día del Amor", "Primavera", "Día de las Madres", 
    "Verano", "Back to School", "Otoño", "Halloween", "Buen Fin", "Navidad"
  ];
  
  let currentDate = new Date(startDate);
  
  for (let i = 1; i <= cycles; i++) {
    const campaignIndex = (i - 1) % campaigns.length;
    const year = currentDate.getFullYear();
    const endDate = new Date(currentDate);
    endDate.setMonth(endDate.getMonth() + 2 + Math.floor(Math.random() * 2));
    
    const isLastCycle = i === cycles;
    const distance = 15 + Math.floor(Math.random() * 30);
    // Peso promedio de ~100kg por ciclo (rango 85-115 kg)
    const weight = 85 + Math.random() * 30;
    const transportEmissions = distance * 0.12;
    const recycledInto = isLastCycle ? null : (Math.random() > 0.5 ? 'exhibitor' : 'graphic') as 'exhibitor' | 'graphic' | null;
    const processingEmissions = recycledInto ? weight * 0.08 : 0;
    
    const lotId = `${exhibitorId}-C${String(i).padStart(2, '0')}`;
    // Merma eficiente de ~1.5%
    const materialRecovered = i === 1 ? 0 : Number((weight * 0.985).toFixed(1));
    const materialSent = recycledInto ? Number((weight * 0.985).toFixed(1)) : 0;
    const savingsVsVirgin = Number((materialRecovered * 3.5).toFixed(1));
    
    history.push({
      id: `GFX-${exhibitorId.split('-').pop()}-${String(i).padStart(3, '0')}`,
      lotId,
      cycleNumber: i,
      campaign: `${campaigns[campaignIndex]} EGO ${year}`,
      client: "EGO",
      brand: "EGO",
      startDate: currentDate.toISOString().split('T')[0],
      endDate: isLastCycle ? null : endDate.toISOString().split('T')[0],
      location: exhibitorLocations[Math.floor(Math.random() * exhibitorLocations.length)],
      recycledInto,
      sourceFromLotId: i === 1 ? null : `${exhibitorId}-C${String(i - 1).padStart(2, '0')}`,
      recycledToLotId: recycledInto ? `${exhibitorId}-C${String(i + 1).padStart(2, '0')}` : null,
      materialRecovered,
      materialSent,
      emissions: {
        transport: Number(transportEmissions.toFixed(2)),
        processing: Number(processingEmissions.toFixed(2)),
        total: Number((transportEmissions + processingEmissions).toFixed(2)),
      },
      savingsVsVirgin,
      distance,
      weight: Number(weight.toFixed(2)),
    });
    
    if (!isLastCycle) {
      currentDate = new Date(endDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
  
  return history;
}

// Exhibidores de EGO
export const egoExhibitors: Exhibitor[] = [
  {
    id: "EXH-EGO-001",
    model: "Charola New Era Verde",
    dimensions: "Charola estándar",
    location: {
      store: "Walmart Polanco",
      address: "Av. Ejército Nacional 843-B",
      city: "CDMX"
    },
    manufactureDate: "2021-03-15",
    yearsInOperation: 3.8,
    currentGraphic: {
      campaign: "Jarritos 2025",
      installedDate: "2024-12-01",
      client: "Jarritos",
      brand: "Jarritos"
    },
    graphicChanges: 15,
    graphicHistory: exh001GraphicHistory,
    condition: "excellent",
    status: "active",
    recycledContent: 60,
    capacityPerShelf: 60,
    clientOwner: "EGO",
    productionSpecs: {
      orderNumber: "OT-90A-2025",
      material: "HDPE MARLEX HMN 6060 UV (BPO 631024)",
      weightPerUnit: 975, // gramos
      totalUnits: 8000,
      totalPallets: 38,
      injectionMachine: "Inyectora #4 Haitian 530T",
      cycleTime: 110, // segundos
      unitsPerHour: 32.727,
      totalHDPE: 7722, // kg
      totalMasterBatch: 78, // kg (1% MB VR-1561-10)
    },
    processPhotos: [
      {
        id: 1,
        title: "Charolas listas para envío",
        description: "8,000 charolas Jarritos emplayadas en tarima",
        imageUrl: "/images/jarritos/tarima-emplayada.jpg",
        date: "Dic 2024",
        weight: "7,800 kg"
      },
      {
        id: 2,
        title: "Producción en planta",
        description: "Charolas recién salidas de inyectora Haitian",
        imageUrl: "/images/jarritos/produccion-planta.jpg",
        date: "Dic 2024",
        weight: "975 gr c/u"
      },
      {
        id: 3,
        title: "Hoja de proceso",
        description: "Especificaciones técnicas OT-90A-2025",
        imageUrl: "/images/jarritos/hoja-proceso.jpg",
        date: "Dic 2024"
      }
    ]
  },
  {
    id: "EXH-EGO-002",
    model: "4R PLANET Estándar",
    dimensions: "41cm x 41cm",
    location: {
      store: "OXXO Reforma",
      address: "Paseo de la Reforma 222",
      city: "CDMX"
    },
    manufactureDate: "2022-06-10",
    yearsInOperation: 2.5,
    currentGraphic: {
      campaign: "Navidad EGO 2024",
      installedDate: "2024-11-01",
      client: "EGO",
      brand: "EGO"
    },
    graphicChanges: 7,
    graphicHistory: generateGraphicHistoryForExhibitor("EXH-EGO-002", 7, "2022-06-10"),
    condition: "excellent",
    status: "active",
    recycledContent: 60,
    capacityPerShelf: 60,
    clientOwner: "EGO"
  },
  {
    id: "EXH-EGO-003",
    model: "4R PLANET Rectangular",
    dimensions: "41cm x 32cm",
    location: {
      store: "Soriana Interlomas",
      address: "Blvd. Interlomas 5",
      city: "Huixquilucan"
    },
    manufactureDate: "2023-01-20",
    yearsInOperation: 1.9,
    currentGraphic: {
      campaign: "Navidad EGO 2024",
      installedDate: "2024-11-01",
      client: "EGO",
      brand: "EGO"
    },
    graphicChanges: 5,
    graphicHistory: generateGraphicHistoryForExhibitor("EXH-EGO-003", 5, "2023-01-20"),
    condition: "excellent",
    status: "active",
    recycledContent: 60,
    capacityPerShelf: 60,
    clientOwner: "EGO"
  },
  {
    id: "EXH-EGO-004",
    model: "4R PLANET Isla",
    dimensions: "82cm x 82cm",
    location: {
      store: "Liverpool Perisur",
      address: "Anillo Periférico 4690",
      city: "CDMX"
    },
    manufactureDate: "2024-03-05",
    yearsInOperation: 0.8,
    currentGraphic: {
      campaign: "Holiday Season 2024",
      installedDate: "2024-11-15",
      client: "EGO",
      brand: "EGO"
    },
    graphicChanges: 3,
    graphicHistory: generateGraphicHistoryForExhibitor("EXH-EGO-004", 3, "2024-03-05"),
    condition: "excellent",
    status: "active",
    recycledContent: 60,
    capacityPerShelf: 60,
    clientOwner: "EGO"
  }
];

// Flujos de economía circular
export const circularFlows = [
  {
    id: 'graphics-to-exhibitors',
    name: 'Gráficos → Exhibidores',
    description: 'Los vinilos usados se reciclan y se convierten en materia prima para nuevos exhibidores',
    icon: '🎨→📦',
    frequency: 'Media',
    color: '#8B5CF6'
  },
  {
    id: 'exhibitors-to-exhibitors',
    name: 'Exhibidores → Exhibidores',
    description: 'Exhibidores viejos (después de 10+ años) se reciclan en nuevos exhibidores',
    icon: '📦→📦',
    frequency: 'Muy baja',
    color: '#3B82F6'
  },
  {
    id: 'graphics-to-graphics',
    name: 'Gráficos → Gráficos',
    description: 'Vinilos usados se reciclan en nuevos vinilos (EL MÁS FRECUENTE)',
    icon: '🎨→🎨',
    frequency: 'Muy alta',
    color: '#10B981'
  }
];

// Actividad reciente del cliente
export const recentActivity = [
  {
    id: '1',
    type: 'graphic_recycled',
    message: 'Gráficos campaña "Back to School 2024" enviados a reciclaje',
    date: '2024-11-01',
    exhibitorId: 'EXH-EGO-001'
  },
  {
    id: '2',
    type: 'graphic_installed',
    message: 'Nuevos gráficos "Navidad 2024" instalados en 23 exhibidores',
    date: '2024-11-01',
    count: 23
  },
  {
    id: '3',
    type: 'milestone',
    message: 'Exhibidor EXH-EGO-001 cumplió 5 años en operación',
    date: '2024-03-15',
    exhibitorId: 'EXH-EGO-001'
  },
  {
    id: '4',
    type: 'graphic_recycled',
    message: 'Gráficos campaña "Verano 2024" reciclados → Nuevos gráficos',
    date: '2024-08-01',
    recycledInto: 'graphic'
  }
];

// Helper functions
export function getExhibitorById(id: string): Exhibitor | undefined {
  return egoExhibitors.find(e => e.id === id);
}

export function getClientExhibitors(): Exhibitor[] {
  return egoExhibitors.filter(e => e.clientOwner === CURRENT_CLIENT.company);
}

export function getTotalGraphicChanges(): number {
  return egoExhibitors.reduce((sum, e) => sum + e.graphicChanges, 0);
}

export function getGraphicsRecycledIntoExhibitors(): number {
  return egoExhibitors.reduce((sum, e) => {
    return sum + e.graphicHistory.filter(g => g.recycledInto === 'exhibitor').length;
  }, 0);
}

export function getGraphicsRecycledIntoGraphics(): number {
  return egoExhibitors.reduce((sum, e) => {
    return sum + e.graphicHistory.filter(g => g.recycledInto === 'graphic').length;
  }, 0);
}

// Calcular estadísticas de un exhibidor
export function calculateExhibitorStats(exhibitor: Exhibitor) {
  const history = exhibitor.graphicHistory;
  const completedCycles = history.filter(g => g.endDate !== null);
  
  const totalEmissions = completedCycles.reduce((sum, g) => sum + g.emissions.total, 0);
  const totalTransport = completedCycles.reduce((sum, g) => sum + g.emissions.transport, 0);
  const totalProcessing = completedCycles.reduce((sum, g) => sum + g.emissions.processing, 0);
  const totalDistance = completedCycles.reduce((sum, g) => sum + g.distance, 0);
  const totalWeight = completedCycles.reduce((sum, g) => sum + g.weight, 0);
  const totalSavingsVsVirgin = completedCycles.reduce((sum, g) => sum + g.savingsVsVirgin, 0);
  
  const recycledToExhibitors = history.filter(g => g.recycledInto === 'exhibitor').length;
  const recycledToGraphics = history.filter(g => g.recycledInto === 'graphic').length;
  
  // Emisiones evitadas = emisiones que se habrían generado con material virgen
  const emissionsAvoided = totalWeight * 3.5; // 3.5 kg CO2e por kg de plástico virgen evitado
  
  return {
    totalCycles: history.length,
    completedCycles: completedCycles.length,
    totalEmissions: Number(totalEmissions.toFixed(2)),
    totalTransport: Number(totalTransport.toFixed(2)),
    totalProcessing: Number(totalProcessing.toFixed(2)),
    totalDistance: Number(totalDistance.toFixed(2)),
    totalWeight: Number(totalWeight.toFixed(2)),
    totalSavingsVsVirgin: Number(totalSavingsVsVirgin.toFixed(2)),
    recycledToExhibitors,
    recycledToGraphics,
    emissionsAvoided: Number(emissionsAvoided.toFixed(2)),
    netBalance: Number((emissionsAvoided - totalEmissions).toFixed(2)),
  };
}

// Obtener el ciclo por lotId
export function getCycleByLotId(lotId: string): GraphicCycle | undefined {
  for (const exhibitor of egoExhibitors) {
    const cycle = exhibitor.graphicHistory.find(c => c.lotId === lotId);
    if (cycle) return cycle;
  }
  return undefined;
}

// Obtener la campaña de un ciclo por su lotId
export function getCampaignByLotId(lotId: string): string {
  const cycle = getCycleByLotId(lotId);
  return cycle ? cycle.campaign : 'Desconocido';
}
