import { Lot, FlowTypeInfo, FlowType } from '@shared/types';

export const flowTypes: FlowTypeInfo[] = [
  {
    id: 'graficos-exhibidores',
    name: 'Gráficos → Exhibidores',
    description: 'Vinilos y películas recicladas convertidas en exhibidores',
    icon: '🎨→📦',
    colorClass: 'bg-purple-500',
    lotCount: 12
  },
  {
    id: 'exhibidores-exhibidores',
    name: 'Exhibidores → Exhibidores',
    description: 'Exhibidores reciclados en nuevos exhibidores',
    icon: '📦→📦',
    colorClass: 'bg-blue-500',
    lotCount: 28
  },
  {
    id: 'graficos-graficos',
    name: 'Gráficos → Gráficos',
    description: 'Vinilos reciclados en nuevos vinilos',
    icon: '🎨→🎨',
    colorClass: 'bg-violet-500',
    lotCount: 8
  }
];

// Cliente actual del portal
export const CURRENT_CLIENT = {
  id: "client-ego",
  name: "EGO",
  type: "Cliente Corporativo",
  industry: "Consumo"
};

// LOTE 7 CICLOS - Exhibidores → Exhibidores (Cliente: EGO)
export const lot7Cycles: Lot = {
  id: "LOT-2024-1847",
  flowType: "exhibidores-exhibidores",
  productType: "Flex Up Display - Floor Standing Island",
  weight: 7.8,
  recycledContent: 85,
  originalDate: "2022-03-15",
  currentCycle: 7,
  totalCycles: 7,
  totalEmissionsAvoided: 105.7,
  totalPlasticRecycled: 54.6,
  status: 'active',
  clientOwner: "EGO",
  cycles: [
    {
      number: 1,
      startDate: "2022-03-15",
      endDate: "2022-05-30",
      client: "P&G",
      brand: "Pantene",
      campaign: "Spring Campaign",
      location: { store: "Walmart Polanco", address: "Av. Ejército Nacional 843", city: "CDMX" },
      returnedToOrigin: false,
      emissions: { transport: 3.8, processing: 5.2, total: 9.0 },
      distance: 85
    },
    {
      number: 2,
      startDate: "2022-06-20",
      endDate: "2022-09-15",
      client: "Coca-Cola",
      brand: "Coca-Cola",
      campaign: "Summer Campaign",
      location: { store: "OXXO Reforma", address: "Paseo de la Reforma 222", city: "CDMX" },
      returnedToOrigin: false,
      emissions: { transport: 4.2, processing: 5.1, total: 9.3 },
      distance: 92
    },
    {
      number: 3,
      startDate: "2022-10-05",
      endDate: "2023-01-10",
      client: "Boing",
      brand: "Boing",
      campaign: "Holiday Campaign",
      location: { store: "Soriana Norte", address: "Av. Insurgentes Norte 1458", city: "CDMX" },
      returnedToOrigin: false,
      emissions: { transport: 3.5, processing: 5.0, total: 8.5 },
      distance: 78
    },
    {
      number: 4,
      startDate: "2023-02-01",
      endDate: "2023-04-05",
      client: "P&G",
      brand: "Ariel",
      campaign: "Valentine's Campaign",
      location: { store: "Liverpool Centro", address: "Venustiano Carranza 92", city: "CDMX" },
      returnedToOrigin: false,
      emissions: { transport: 4.0, processing: 5.3, total: 9.3 },
      distance: 88
    },
    {
      number: 5,
      startDate: "2023-04-25",
      endDate: "2023-07-20",
      client: "Santa Clara",
      brand: "Santa Clara",
      campaign: "Mother's Day",
      location: { store: "Bodega Aurrera", address: "Insurgentes Sur 1234", city: "CDMX" },
      returnedToOrigin: false,
      emissions: { transport: 3.9, processing: 5.1, total: 9.0 },
      distance: 82
    },
    {
      number: 6,
      startDate: "2023-08-10",
      endDate: "2023-11-30",
      client: "Jarritos",
      brand: "Jarritos",
      campaign: "Back to School",
      location: { store: "Walmart Insurgentes", address: "Insurgentes Sur 1971", city: "CDMX" },
      returnedToOrigin: false,
      emissions: { transport: 4.1, processing: 5.2, total: 9.3 },
      distance: 90
    },
    {
      number: 7,
      startDate: "2023-12-15",
      endDate: null,
      client: "P&G",
      brand: "Pantene",
      campaign: "New Year Campaign",
      location: { store: "Walmart Polanco", address: "Av. Ejército Nacional 843", city: "CDMX" },
      returnedToOrigin: true,
      emissions: { transport: 3.8, processing: 5.2, total: 9.0 },
      distance: 85
    }
  ]
};

// LOTE 5 CICLOS - Gráficos → Exhibidores (Cliente: EGO)
export const lot5Cycles: Lot = {
  id: "LOT-2024-2156",
  flowType: "graficos-exhibidores",
  productType: "Flex Up Display - Counter Top",
  weight: 3.2,
  recycledContent: 80,
  originalDate: "2023-01-10",
  currentCycle: 5,
  totalCycles: 5,
  totalEmissionsAvoided: 75.2,
  totalPlasticRecycled: 39.0,
  status: 'active',
  clientOwner: "EGO",
  cycles: [
    {
      number: 1,
      startDate: "2023-01-10",
      endDate: "2023-03-15",
      client: "Coca-Cola",
      brand: "Sprite",
      campaign: "New Year Refresh",
      location: { store: "OXXO Reforma", address: "Paseo de la Reforma 222", city: "CDMX" },
      returnedToOrigin: false,
      emissions: { transport: 2.8, processing: 4.2, total: 7.0 },
      distance: 65
    },
    {
      number: 2,
      startDate: "2023-04-01",
      endDate: "2023-06-20",
      client: "Bokados",
      brand: "Bokados",
      campaign: "Spring Snacks",
      location: { store: "Bodega Aurrera", address: "Insurgentes Sur 1234", city: "CDMX" },
      returnedToOrigin: false,
      emissions: { transport: 3.0, processing: 4.1, total: 7.1 },
      distance: 70
    },
    {
      number: 3,
      startDate: "2023-07-10",
      endDate: "2023-09-25",
      client: "Suerox",
      brand: "Suerox",
      campaign: "Summer Hydration",
      location: { store: "Soriana Norte", address: "Av. Insurgentes Norte 1458", city: "CDMX" },
      returnedToOrigin: false,
      emissions: { transport: 2.9, processing: 4.0, total: 6.9 },
      distance: 68
    },
    {
      number: 4,
      startDate: "2023-10-15",
      endDate: "2023-12-30",
      client: "Henkel",
      brand: "Persil",
      campaign: "Holiday Clean",
      location: { store: "Liverpool Centro", address: "Venustiano Carranza 92", city: "CDMX" },
      returnedToOrigin: false,
      emissions: { transport: 3.1, processing: 4.2, total: 7.3 },
      distance: 72
    },
    {
      number: 5,
      startDate: "2024-01-20",
      endDate: null,
      client: "Coca-Cola",
      brand: "Sprite",
      campaign: "2024 Kickoff",
      location: { store: "OXXO Reforma", address: "Paseo de la Reforma 222", city: "CDMX" },
      returnedToOrigin: true,
      emissions: { transport: 2.8, processing: 4.2, total: 7.0 },
      distance: 65
    }
  ]
};

// LOTE 3 CICLOS - Gráficos → Gráficos (Cliente: JARRITOS)
export const lot3Cycles: Lot = {
  id: "LOT-2024-3021",
  flowType: "graficos-graficos",
  productType: "Vinyl Graphics Roll - Large Format",
  weight: 2.5,
  recycledContent: 70,
  originalDate: "2024-02-01",
  currentCycle: 3,
  totalCycles: 3,
  totalEmissionsAvoided: 45.3,
  totalPlasticRecycled: 23.4,
  status: 'active',
  clientOwner: "JARRITOS",
  cycles: [
    {
      number: 1,
      startDate: "2024-02-01",
      endDate: "2024-04-15",
      client: "Boing",
      brand: "Boing",
      campaign: "Fruit Season",
      location: { store: "Soriana Norte", address: "Av. Insurgentes Norte 1458", city: "CDMX" },
      returnedToOrigin: false,
      emissions: { transport: 2.2, processing: 3.5, total: 5.7 },
      distance: 55
    },
    {
      number: 2,
      startDate: "2024-05-01",
      endDate: "2024-07-30",
      client: "Las Toluqueñas",
      brand: "Las Toluqueñas",
      campaign: "Summer Chorizo",
      location: { store: "Walmart Insurgentes", address: "Insurgentes Sur 1971", city: "CDMX" },
      returnedToOrigin: false,
      emissions: { transport: 2.4, processing: 3.6, total: 6.0 },
      distance: 58
    },
    {
      number: 3,
      startDate: "2024-08-15",
      endDate: null,
      client: "Avivia",
      brand: "Avivia",
      campaign: "Back to School",
      location: { store: "Liverpool Centro", address: "Venustiano Carranza 92", city: "CDMX" },
      returnedToOrigin: false,
      emissions: { transport: 2.3, processing: 3.5, total: 5.8 },
      distance: 56
    }
  ]
};

// Lotes adicionales de EGO
const egoLot1: Lot = {
  id: "LOT-2024-4201",
  flowType: "exhibidores-exhibidores",
  productType: "Flex Up Display - Shelf Talker",
  weight: 4.5,
  recycledContent: 82,
  originalDate: "2023-06-10",
  currentCycle: 4,
  totalCycles: 4,
  totalEmissionsAvoided: 62.8,
  totalPlasticRecycled: 32.5,
  status: 'active',
  clientOwner: "EGO",
  cycles: [
    {
      number: 1,
      startDate: "2023-06-10",
      endDate: "2023-08-20",
      client: "EGO",
      brand: "EGO",
      campaign: "Summer Launch",
      location: { store: "Walmart Santa Fe", address: "Av. Vasco de Quiroga 3800", city: "CDMX" },
      returnedToOrigin: false,
      emissions: { transport: 3.2, processing: 4.5, total: 7.7 },
      distance: 75
    },
    {
      number: 2,
      startDate: "2023-09-05",
      endDate: "2023-11-15",
      client: "EGO",
      brand: "EGO",
      campaign: "Fall Collection",
      location: { store: "Soriana Interlomas", address: "Blvd. Interlomas 5", city: "Estado de México" },
      returnedToOrigin: false,
      emissions: { transport: 3.4, processing: 4.6, total: 8.0 },
      distance: 80
    },
    {
      number: 3,
      startDate: "2023-12-01",
      endDate: "2024-02-28",
      client: "EGO",
      brand: "EGO",
      campaign: "Holiday Season",
      location: { store: "Liverpool Perisur", address: "Anillo Periférico 4690", city: "CDMX" },
      returnedToOrigin: false,
      emissions: { transport: 3.1, processing: 4.4, total: 7.5 },
      distance: 72
    },
    {
      number: 4,
      startDate: "2024-03-15",
      endDate: null,
      client: "EGO",
      brand: "EGO",
      campaign: "Spring Launch",
      location: { store: "Walmart Santa Fe", address: "Av. Vasco de Quiroga 3800", city: "CDMX" },
      returnedToOrigin: true,
      emissions: { transport: 3.2, processing: 4.5, total: 7.7 },
      distance: 75
    }
  ]
};

const egoLot2: Lot = {
  id: "LOT-2024-4502",
  flowType: "graficos-exhibidores",
  productType: "Flex Up Display - Wall Mounted",
  weight: 5.2,
  recycledContent: 78,
  originalDate: "2023-08-01",
  currentCycle: 3,
  totalCycles: 3,
  totalEmissionsAvoided: 52.3,
  totalPlasticRecycled: 27.1,
  status: 'active',
  clientOwner: "EGO",
  cycles: [
    {
      number: 1,
      startDate: "2023-08-01",
      endDate: "2023-10-15",
      client: "EGO",
      brand: "EGO",
      campaign: "Back to School",
      location: { store: "Chedraui Coyoacán", address: "Av. Coyoacán 1234", city: "CDMX" },
      returnedToOrigin: false,
      emissions: { transport: 3.5, processing: 4.8, total: 8.3 },
      distance: 82
    },
    {
      number: 2,
      startDate: "2023-11-01",
      endDate: "2024-01-20",
      client: "EGO",
      brand: "EGO",
      campaign: "Winter Collection",
      location: { store: "Soriana Lindavista", address: "Av. Montevideo 363", city: "CDMX" },
      returnedToOrigin: false,
      emissions: { transport: 3.3, processing: 4.7, total: 8.0 },
      distance: 78
    },
    {
      number: 3,
      startDate: "2024-02-01",
      endDate: null,
      client: "EGO",
      brand: "EGO",
      campaign: "Valentine's Day",
      location: { store: "Liverpool Insurgentes", address: "Av. Insurgentes Sur 1310", city: "CDMX" },
      returnedToOrigin: false,
      emissions: { transport: 3.4, processing: 4.8, total: 8.2 },
      distance: 80
    }
  ]
};

const egoLot3: Lot = {
  id: "LOT-2024-5103",
  flowType: "exhibidores-exhibidores",
  productType: "Flex Up Display - Floor Standing",
  weight: 6.8,
  recycledContent: 88,
  originalDate: "2023-03-10",
  currentCycle: 5,
  totalCycles: 5,
  totalEmissionsAvoided: 89.5,
  totalPlasticRecycled: 46.3,
  status: 'active',
  clientOwner: "EGO",
  cycles: [
    {
      number: 1,
      startDate: "2023-03-10",
      endDate: "2023-05-25",
      client: "EGO",
      brand: "EGO",
      campaign: "Spring Launch",
      location: { store: "Bodega Aurrera Tlalpan", address: "Calzada de Tlalpan 4320", city: "CDMX" },
      returnedToOrigin: false,
      emissions: { transport: 3.6, processing: 4.9, total: 8.5 },
      distance: 85
    },
    {
      number: 2,
      startDate: "2023-06-10",
      endDate: "2023-08-30",
      client: "EGO",
      brand: "EGO",
      campaign: "Summer Promo",
      location: { store: "Walmart Satélite", address: "Circuito Centro Comercial 2251", city: "Estado de México" },
      returnedToOrigin: false,
      emissions: { transport: 3.8, processing: 5.0, total: 8.8 },
      distance: 88
    },
    {
      number: 3,
      startDate: "2023-09-15",
      endDate: "2023-11-30",
      client: "EGO",
      brand: "EGO",
      campaign: "Fall Festival",
      location: { store: "Soriana Santa Fe", address: "Av. Santa Fe 94", city: "CDMX" },
      returnedToOrigin: false,
      emissions: { transport: 3.7, processing: 4.9, total: 8.6 },
      distance: 86
    },
    {
      number: 4,
      startDate: "2023-12-15",
      endDate: "2024-03-01",
      client: "EGO",
      brand: "EGO",
      campaign: "Holiday Season",
      location: { store: "Chedraui Interlomas", address: "Blvd. Magnocentro 4", city: "Estado de México" },
      returnedToOrigin: false,
      emissions: { transport: 3.9, processing: 5.1, total: 9.0 },
      distance: 90
    },
    {
      number: 5,
      startDate: "2024-03-20",
      endDate: null,
      client: "EGO",
      brand: "EGO",
      campaign: "Spring Collection",
      location: { store: "Bodega Aurrera Tlalpan", address: "Calzada de Tlalpan 4320", city: "CDMX" },
      returnedToOrigin: true,
      emissions: { transport: 3.6, processing: 4.9, total: 8.5 },
      distance: 85
    }
  ]
};

// Lotes de otros clientes (FEMSA, Pedigree, P&G, Coca-Cola, etc.)
const femsaLot1: Lot = {
  id: "LOT-2024-6201",
  flowType: "graficos-exhibidores",
  productType: "Flex Up Display - Counter Display",
  weight: 3.8,
  recycledContent: 75,
  originalDate: "2023-07-15",
  currentCycle: 4,
  totalCycles: 4,
  totalEmissionsAvoided: 68.4,
  totalPlasticRecycled: 35.4,
  status: 'active',
  clientOwner: "FEMSA",
  cycles: [
    {
      number: 1,
      startDate: "2023-07-15",
      endDate: "2023-09-30",
      client: "FEMSA",
      brand: "OXXO",
      campaign: "Summer Drinks",
      location: { store: "OXXO Reforma 420", address: "Paseo de la Reforma 420", city: "CDMX" },
      returnedToOrigin: false,
      emissions: { transport: 3.0, processing: 4.3, total: 7.3 },
      distance: 70
    },
    {
      number: 2,
      startDate: "2023-10-15",
      endDate: "2023-12-31",
      client: "FEMSA",
      brand: "OXXO",
      campaign: "Holiday Specials",
      location: { store: "OXXO Polanco", address: "Av. Horacio 1120", city: "CDMX" },
      returnedToOrigin: false,
      emissions: { transport: 3.1, processing: 4.4, total: 7.5 },
      distance: 72
    },
    {
      number: 3,
      startDate: "2024-01-15",
      endDate: "2024-03-30",
      client: "FEMSA",
      brand: "OXXO",
      campaign: "New Year Promo",
      location: { store: "OXXO Insurgentes", address: "Av. Insurgentes Sur 1605", city: "CDMX" },
      returnedToOrigin: false,
      emissions: { transport: 2.9, processing: 4.2, total: 7.1 },
      distance: 68
    },
    {
      number: 4,
      startDate: "2024-04-10",
      endDate: null,
      client: "FEMSA",
      brand: "OXXO",
      campaign: "Spring Launch",
      location: { store: "OXXO Reforma 420", address: "Paseo de la Reforma 420", city: "CDMX" },
      returnedToOrigin: true,
      emissions: { transport: 3.0, processing: 4.3, total: 7.3 },
      distance: 70
    }
  ]
};

const pedigreeLot1: Lot = {
  id: "LOT-2024-7105",
  flowType: "exhibidores-exhibidores",
  productType: "Flex Up Display - Pet Food Endcap",
  weight: 8.2,
  recycledContent: 90,
  originalDate: "2022-10-01",
  currentCycle: 6,
  totalCycles: 6,
  totalEmissionsAvoided: 112.3,
  totalPlasticRecycled: 58.1,
  status: 'active',
  clientOwner: "PEDIGREE",
  cycles: [
    {
      number: 1,
      startDate: "2022-10-01",
      endDate: "2022-12-15",
      client: "Pedigree",
      brand: "Pedigree",
      campaign: "Adopt a Pet Campaign",
      location: { store: "Walmart Perisur", address: "Anillo Periférico Sur 4690", city: "CDMX" },
      returnedToOrigin: false,
      emissions: { transport: 4.0, processing: 5.5, total: 9.5 },
      distance: 95
    },
    {
      number: 2,
      startDate: "2023-01-10",
      endDate: "2023-03-31",
      client: "Pedigree",
      brand: "Pedigree",
      campaign: "New Year Pet Care",
      location: { store: "Soriana Coapa", address: "Canal de Miramontes 2155", city: "CDMX" },
      returnedToOrigin: false,
      emissions: { transport: 4.2, processing: 5.6, total: 9.8 },
      distance: 98
    },
    {
      number: 3,
      startDate: "2023-04-15",
      endDate: "2023-07-10",
      client: "Pedigree",
      brand: "Pedigree",
      campaign: "Summer Pet Health",
      location: { store: "Liverpool Perisur", address: "Anillo Periférico 4690", city: "CDMX" },
      returnedToOrigin: false,
      emissions: { transport: 3.9, processing: 5.4, total: 9.3 },
      distance: 92
    },
    {
      number: 4,
      startDate: "2023-08-01",
      endDate: "2023-10-20",
      client: "Pedigree",
      brand: "Pedigree",
      campaign: "Back to School Pets",
      location: { store: "Walmart Lindavista", address: "Av. Montevideo 363", city: "CDMX" },
      returnedToOrigin: false,
      emissions: { transport: 4.1, processing: 5.5, total: 9.6 },
      distance: 96
    },
    {
      number: 5,
      startDate: "2023-11-05",
      endDate: "2024-01-30",
      client: "Pedigree",
      brand: "Pedigree",
      campaign: "Holiday Pet Joy",
      location: { store: "Soriana Plaza Oriente", address: "Av. Ignacio Zaragoza 1711", city: "CDMX" },
      returnedToOrigin: false,
      emissions: { transport: 4.3, processing: 5.7, total: 10.0 },
      distance: 100
    },
    {
      number: 6,
      startDate: "2024-02-15",
      endDate: null,
      client: "Pedigree",
      brand: "Pedigree",
      campaign: "Pet Love Campaign",
      location: { store: "Walmart Perisur", address: "Anillo Periférico Sur 4690", city: "CDMX" },
      returnedToOrigin: true,
      emissions: { transport: 4.0, processing: 5.5, total: 9.5 },
      distance: 95
    }
  ]
};

export const allLots: Lot[] = [
  lot7Cycles, 
  lot5Cycles, 
  lot3Cycles,
  egoLot1,
  egoLot2,
  egoLot3,
  femsaLot1,
  pedigreeLot1
];

export const getLotsByFlowType = (flowType: FlowType): Lot[] => {
  return allLots.filter(lot => lot.flowType === flowType);
};

export const getLotById = (id: string): Lot | undefined => {
  return allLots.find(lot => lot.id === id);
};
