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
    description: 'Crear reporte ESR, GRI, NIS o Alcance 3',
    icon: 'FileText',
    steps: [
      {
        element: '[data-tour="nav-trazabilidad"]',
        popover: {
          title: '¡Generemos tu reporte!',
          description: 'Los reportes de sustentabilidad están dentro de Trazabilidad.',
          side: 'bottom',
        },
      },
      {
        navigateTo: '/trazabilidad',
        delay: 500,
        element: '[data-tour="tab-reportes"]',
        popover: {
          title: 'Pestaña de Reportes',
          description: 'Haz clic en "Reportes" para ver todos los estándares disponibles.',
          side: 'bottom',
        },
      },
    ],
  },
  {
    id: 'traceability',
    name: '¿Dónde está mi lote?',
    description: 'Rastrear un exhibidor específico',
    icon: 'Search',
    steps: [
      {
        element: '[data-tour="nav-trazabilidad"]',
        popover: {
          title: '¡Vamos a encontrar tu exhibidor!',
          description: 'En Trazabilidad puedes ver todos los exhibidores de tu empresa.',
          side: 'bottom',
        },
      },
      {
        navigateTo: '/trazabilidad',
        delay: 500,
        element: '[data-tour="tab-exhibidores"]',
        popover: {
          title: 'Tus exhibidores',
          description: 'En "Mis Exhibidores" están todos tus exhibidores. Haz clic en cualquiera para ver su trazabilidad.',
          side: 'bottom',
        },
      },
    ],
  },
  {
    id: 'impact',
    name: 'Mi Impacto Ambiental',
    description: 'Ver el impacto de mi empresa',
    icon: 'Leaf',
    steps: [
      {
        element: '[data-tour="nav-dashboard"]',
        popover: {
          title: '¡Veamos tu impacto!',
          description: 'El Dashboard te muestra un resumen ejecutivo de todo tu impacto ambiental.',
          side: 'bottom',
        },
      },
      {
        navigateTo: '/',
        delay: 500,
        element: '[data-tour="dashboard-kpis"]',
        popover: {
          title: 'Métricas clave',
          description: 'Exhibidores activos, ciclos de gráficos, y tu balance de CO2. Lo más importante de un vistazo.',
          side: 'bottom',
        },
      },
      {
        element: '[data-tour="dashboard-impacto"]',
        popover: {
          title: 'Impacto ambiental',
          description: 'CO2 evitado, agua ahorrada, energía... Todo lo que tu empresa ha logrado con economía circular.',
          side: 'top',
        },
      },
      {
        element: '[data-tour="dashboard-comparativa"]',
        popover: {
          title: 'Comparativa',
          description: '¡Impresionante! Así te comparas con el sistema tradicional. Mira cuánto has ahorrado.',
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
      title: 'Historia del exhibidor',
      description: 'Aquí ves la historia completa: cuándo comenzó, cuántos ciclos ha completado y su impacto acumulado.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="trazabilidad-espiral"]',
    popover: {
      title: 'Ciclo de vida circular',
      description: 'Cada punto en el espiral es un ciclo de vida. El material se recicla y regresa al ciclo una y otra vez.',
      side: 'left',
    },
  },
  {
    element: '[data-tour="trazabilidad-timeline"]',
    popover: {
      title: 'Historial de reciclaje',
      description: 'El flujo completo de reciclaje: origen del material, campañas de marketing, y destino de cada ciclo.',
      side: 'top',
    },
  },
];

export function getFlowById(id: TourFlowType): TourFlow | undefined {
  return tourFlows.find(flow => flow.id === id);
}
