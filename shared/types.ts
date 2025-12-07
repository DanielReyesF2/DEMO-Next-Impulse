export type FlowType = 'graficos-exhibidores' | 'exhibidores-exhibidores' | 'graficos-graficos';

export interface Location {
  store: string;
  address: string;
  city: string;
}

export interface CycleEmissions {
  transport: number;
  processing: number;
  total: number;
}

export interface Cycle {
  number: number;
  startDate: string;
  endDate: string | null; // null = activo
  client: string;
  brand: string;
  campaign: string;
  location: Location;
  returnedToOrigin: boolean;
  emissions: CycleEmissions;
  distance: number;
}

export interface Lot {
  id: string;
  flowType: FlowType;
  productType: string;
  weight: number;
  recycledContent: number;
  originalDate: string;
  currentCycle: number;
  totalCycles: number;
  cycles: Cycle[];
  totalEmissionsAvoided: number;
  totalPlasticRecycled: number;
  status: 'active' | 'collected' | 'processing';
  clientOwner: string; // Cliente dueño del lote (EGO, FEMSA, PEDIGREE, etc.)
}

export interface FlowTypeInfo {
  id: FlowType;
  name: string;
  description: string;
  icon: string;
  colorClass: string;
  lotCount: number;
}
