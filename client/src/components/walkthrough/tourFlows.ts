// Definición de los flujos de tour para el walkthrough

export type TourFlowType = 'permits' | 'reports' | 'traceability' | 'impact';

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
    id: 'permits',
    name: 'Permisos Ambientales',
    description: 'Ver el estado de mis permisos y autorizaciones',
    icon: 'FileCheck',
    steps: [
      {
        element: '[data-tour="nav-documentos"]',
        popover: {
          title: '¡Vamos a revisar tus permisos!',
          description: 'En Control Documental tienes todos tus permisos y autorizaciones ambientales.',
          side: 'bottom',
        },
      },
      {
        navigateTo: '/documentos',
        delay: 500,
        element: '[data-tour="documentos-kpis"]',
        popover: {
          title: 'Resumen de permisos',
          description: 'Aquí ves el estado general: permisos vigentes, por vencer y vencidos. Todo de un vistazo.',
          side: 'bottom',
        },
      },
      {
        element: '[data-tour="documentos-tabla"]',
        popover: {
          title: 'Lista completa',
          description: 'Todos tus documentos con fechas de emisión, vencimiento y estado. Los que están por vencer se marcan en amarillo.',
          side: 'top',
        },
      },
      {
        element: '[data-tour="documentos-filtros"]',
        popover: {
          title: 'Filtra fácilmente',
          description: 'Puedes filtrar por tipo de documento o estado para encontrar lo que buscas rápidamente.',
          side: 'bottom',
        },
      },
    ],
  },
  {
    id: 'reports',
    name: 'Mi Reporte Ambiental',
    description: 'Generar reporte GRI, SASB, ISSB o CDP',
    icon: 'FileText',
    steps: [
      {
        element: '[data-tour="nav-reportes"]',
        popover: {
          title: '¡Generemos tu reporte!',
          description: 'En Reportes puedes generar informes de sustentabilidad en diferentes estándares internacionales.',
          side: 'bottom',
        },
      },
      {
        navigateTo: '/reportes',
        delay: 500,
        element: '[data-tour="reportes-selector"]',
        popover: {
          title: 'Elige el estándar',
          description: 'Selecciona el formato que necesitas: GRI Standards, SASB, ISSB (IFRS S2) o CDP Climate. Cada uno tiene métricas específicas.',
          side: 'bottom',
        },
      },
      {
        element: '[data-tour="reportes-preview"]',
        popover: {
          title: 'Vista previa',
          description: 'Aquí ves cómo quedará tu reporte. El contenido cambia automáticamente según el estándar seleccionado.',
          side: 'top',
        },
      },
      {
        element: '[data-tour="reportes-download"]',
        popover: {
          title: 'Descarga tu reporte',
          description: '¡Listo! Puedes descargar en PDF o Excel para compartir con tu equipo o auditorías.',
          side: 'left',
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
        element: '[data-tour="nav-exhibidores"]',
        popover: {
          title: '¡Vamos a encontrar tu exhibidor!',
          description: 'En Mis Exhibidores puedes ver todos los exhibidores activos de tu empresa.',
          side: 'bottom',
        },
      },
      {
        navigateTo: '/exhibidores',
        delay: 500,
        element: '[data-tour="exhibidores-lista"]',
        popover: {
          title: 'Tus exhibidores',
          description: 'Aquí están todos tus exhibidores. Cada tarjeta muestra el ID, ubicación, ciclos completados y estado.',
          side: 'top',
        },
      },
      {
        element: '[data-tour="exhibidor-card"]',
        popover: {
          title: 'Selecciona uno',
          description: 'Haz clic en cualquier exhibidor para ver su trazabilidad completa. Vamos a ver este...',
          side: 'right',
        },
      },
      // Los siguientes steps se agregan dinámicamente con el ID del lote
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

