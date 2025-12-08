// Definición de los flujos de tour para el walkthrough

export type TourFlowType = 'reports' | 'traceability' | 'impact';

export interface TourStep {
  element?: string; // data-tour selector
  popover: {
    title: string;
    description: string;
    side?: 'top' | 'bottom' | 'left' | 'right';
    align?: 'start' | 'center' | 'end';
  };
  navigateTo?: string; // URL to navigate before showing this step
  delay?: number; // Delay in ms before showing this step (for page load)
}

export interface TourFlow {
  id: TourFlowType;
  name: string;
  description: string;
  icon: string;
  steps: TourStep[];
}

export const tourFlows: TourFlow[] = [
  {
    id: 'reports',
    name: 'Generar Reporte',
    description: 'Para tu informe de sustentabilidad',
    icon: 'FileText',
    steps: [
      {
        element: '[data-tour="nav-trazabilidad"]',
        popover: {
          title: '¡Vamos a crear tu reporte!',
          description: 'Primero entramos a Trazabilidad.',
          side: 'bottom',
        },
      },
      {
        navigateTo: '/trazabilidad',
        delay: 500,
        element: '[data-tour="tab-reportes"]',
        popover: {
          title: 'Aquí están los reportes',
          description: 'Haz clic aquí para elegir qué tipo de reporte necesitas.',
          side: 'bottom',
        },
      },
    ],
  },
  {
    id: 'traceability',
    name: '¿Dónde está mi exhibidor?',
    description: 'Buscar un exhibidor específico',
    icon: 'Search',
    steps: [
      {
        element: '[data-tour="nav-trazabilidad"]',
        popover: {
          title: '¡Busquemos tu exhibidor!',
          description: 'Aquí están todos tus exhibidores.',
          side: 'bottom',
        },
      },
      {
        navigateTo: '/trazabilidad',
        delay: 500,
        element: '[data-tour="tab-exhibidores"]',
        popover: {
          title: 'Tu inventario',
          description: 'Aquí ves todos. Haz clic en uno para ver su historia completa.',
          side: 'bottom',
        },
      },
    ],
  },
  {
    id: 'impact',
    name: '¿Cuánto he ahorrado?',
    description: 'Ver tu ahorro ambiental',
    icon: 'Leaf',
    steps: [
      {
        element: '[data-tour="nav-dashboard"]',
        popover: {
          title: '¡Veamos tus ahorros!',
          description: 'Aquí está el resumen de todo lo que has logrado.',
          side: 'bottom',
        },
      },
      {
        navigateTo: '/',
        delay: 500,
        element: '[data-tour="dashboard-kpis"]',
        popover: {
          title: 'Los números importantes',
          description: 'Cuántos exhibidores tienes, cuántas veces has reciclado, y cuánto CO₂ has evitado.',
          side: 'bottom',
        },
      },
      {
        element: '[data-tour="dashboard-impacto"]',
        popover: {
          title: 'Tu huella verde',
          description: 'Mira cuánta agua, energía y recursos has ahorrado. ¡Todo gracias al reciclaje!',
          side: 'top',
        },
      },
      {
        element: '[data-tour="dashboard-comparativa"]',
        popover: {
          title: '¿Cuánto te ahorraste?',
          description: 'Esto es lo que habrías gastado sin reciclar vs. lo que gastaste reciclando. ¡Mira la diferencia!',
          side: 'top',
        },
      },
    ],
  },
];

// Steps adicionales para trazabilidad (se agregan dinámicamente)
export const traceabilityDetailSteps: TourStep[] = [
  {
    element: '[data-tour="trazabilidad-banner"]',
    popover: {
      title: 'La vida de tu exhibidor',
      description: 'Cuándo llegó, cuántas veces se ha reciclado, y cuánto ha ayudado al planeta.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="trazabilidad-espiral"]',
    popover: {
      title: 'Su historia de reciclaje',
      description: 'Cada círculo es una vez que el material se recicló y volvió a usarse. ¡Entre más círculos, más veces se recicló!',
      side: 'left',
    },
  },
  {
    element: '[data-tour="trazabilidad-timeline"]',
    popover: {
      title: 'Todo el recorrido',
      description: 'De dónde vino el material, qué campañas tuvo, y a dónde fue después de cada uso.',
      side: 'top',
    },
  },
];

export function getFlowById(id: TourFlowType): TourFlow | undefined {
  return tourFlows.find(flow => flow.id === id);
}

