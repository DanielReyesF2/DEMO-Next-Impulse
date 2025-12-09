// Definición de los flujos de tour para el walkthrough
// OBJETIVO: ~3 minutos de exploración interactiva

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
    description: 'ESR, GRI, ISO 14001, Alcance 3',
    icon: 'FileText',
    steps: [
      {
        popover: {
          title: '📊 ¡Vamos a generar un reporte!',
          description: 'Te voy a mostrar cómo crear reportes de sustentabilidad para tus auditorías, certificaciones o informes anuales.',
          side: 'bottom',
        },
      },
      {
        element: '[data-tour="nav-trazabilidad"]',
        popover: {
          title: 'Paso 1: Entra a Trazabilidad',
          description: 'Todos los reportes se generan desde aquí, porque usamos los datos reales de tus exhibidores.',
          side: 'bottom',
        },
      },
      {
        navigateTo: '/trazabilidad',
        delay: 600,
        element: '[data-tour="tab-reportes"]',
        popover: {
          title: 'Paso 2: Pestaña de Reportes',
          description: 'Aquí están todos los formatos de reporte disponibles. Haz clic para verlos.',
          side: 'bottom',
        },
      },
      {
        delay: 300,
        popover: {
          title: '5 formatos disponibles',
          description: 'ESR CEMEFI para responsabilidad social, GRI para estándares globales, ISO 14001 para gestión ambiental, NIS México para normativa local, y Alcance 3 para huella de carbono.',
          side: 'bottom',
        },
      },
      {
        popover: {
          title: '¿Cómo funciona?',
          description: 'Seleccionas el formato → Lo previsualizas → Lo descargas como PDF. Así de simple. Todos usan los datos reales de tus exhibidores.',
          side: 'bottom',
        },
      },
      {
        popover: {
          title: '✅ ¡Listo!',
          description: 'Ahora ya sabes dónde generar reportes. Prueba generar uno con tus datos reales.',
          side: 'bottom',
        },
      },
    ],
  },
  {
    id: 'traceability',
    name: '¿Dónde está mi exhibidor?',
    description: 'Ver la historia completa de reciclaje',
    icon: 'Search',
    steps: [
      {
        popover: {
          title: '🔍 ¡Busquemos un exhibidor!',
          description: 'Te voy a mostrar cómo ver la trazabilidad completa de cualquier exhibidor: de dónde viene el material, cuántas veces se ha reciclado, y a dónde fue.',
          side: 'bottom',
        },
      },
      {
        element: '[data-tour="nav-trazabilidad"]',
        popover: {
          title: 'Paso 1: Entra a Trazabilidad',
          description: 'Aquí está toda la información de tus exhibidores.',
          side: 'bottom',
        },
      },
      {
        navigateTo: '/trazabilidad',
        delay: 600,
        element: '[data-tour="tab-exhibidores"]',
        popover: {
          title: 'Paso 2: Mis Exhibidores',
          description: 'Aquí ves el inventario completo. Cada tarjeta muestra cuántas veces se ha reciclado ese exhibidor y cuánto CO₂ ha ahorrado.',
          side: 'bottom',
        },
      },
      {
        delay: 300,
        popover: {
          title: '¿Qué ves en cada tarjeta?',
          description: 'El ID del exhibidor, su ubicación actual, veces reciclado, kg de CO₂ ahorrado, y kg de material reciclado. Haz clic en cualquiera para ver su historia completa.',
          side: 'bottom',
        },
      },
      {
        navigateTo: '/trazabilidad/EXH-EGO-001',
        delay: 800,
        element: '[data-tour="trazabilidad-banner"]',
        popover: {
          title: 'La historia de este exhibidor',
          description: 'Aquí ves el resumen: cuándo empezó, cuántas veces se ha reciclado, y cuánto CO₂ ha ahorrado en total.',
          side: 'bottom',
        },
      },
      {
        element: '[data-tour="trazabilidad-espiral"]',
        popover: {
          title: 'El ciclo de vida visual',
          description: 'Cada círculo es una vez que el material se recicló. Los verdes fueron a nuevos gráficos, los azules a nuevos exhibidores. El punto amarillo es el ciclo actual.',
          side: 'left',
        },
      },
      {
        element: '[data-tour="trazabilidad-timeline"]',
        popover: {
          title: 'Detalle de cada ciclo',
          description: 'Expande cualquier ciclo para ver: de dónde vino el material, cuántos kg, qué campaña tuvo, y a dónde fue después.',
          side: 'top',
        },
      },
      {
        popover: {
          title: '✅ ¡Trazabilidad completa!',
          description: 'Ahora ya sabes cómo rastrear cualquier exhibidor. Puedes ver su origen, su historia, y a dónde fue el material cada vez que se recicló.',
          side: 'bottom',
        },
      },
    ],
  },
  {
    id: 'impact',
    name: '¿Cuánto he ahorrado?',
    description: 'Ver tu impacto ambiental total',
    icon: 'Leaf',
    steps: [
      {
        popover: {
          title: '🌍 ¡Veamos tu impacto!',
          description: 'Te voy a mostrar todo lo que has logrado reciclando: cuánto CO₂ evitaste, cuánta agua ahorraste, y cuánto dinero te has ahorrado.',
          side: 'bottom',
        },
      },
      {
        element: '[data-tour="nav-dashboard"]',
        popover: {
          title: 'Paso 1: El Dashboard',
          description: 'Aquí está el resumen ejecutivo de todo tu impacto ambiental.',
          side: 'bottom',
        },
      },
      {
        navigateTo: '/',
        delay: 600,
        element: '[data-tour="dashboard-kpis"]',
        popover: {
          title: 'Los números clave',
          description: '4 exhibidores activos, 30 veces reciclado, 7.5 ciclos promedio por exhibidor, y -146 kg de CO₂ ahorrados. Estos números se actualizan en tiempo real.',
          side: 'bottom',
        },
      },
      {
        element: '[data-tour="dashboard-impacto"]',
        popover: {
          title: 'Tu huella verde',
          description: 'Mira las equivalencias: CO₂ evitado, litros de agua ahorrados, energía, árboles equivalentes, km de auto no recorridos, y kg de plástico reciclado.',
          side: 'top',
        },
      },
      {
        element: '[data-tour="dashboard-comparativa"]',
        popover: {
          title: 'Reciclaje vs. No reciclar',
          description: 'Esta comparativa muestra cuánto gastarías sin reciclar vs. con reciclaje. Mira las barras: -97% en CO₂, -77% en costos, y -100% en basura.',
          side: 'top',
        },
      },
      {
        popover: {
          title: 'Lo que sigue',
          description: 'Desde aquí puedes ir a "Trazabilidad" para ver el detalle de cada exhibidor, o generar reportes para compartir estos números con tu equipo.',
          side: 'bottom',
        },
      },
      {
        popover: {
          title: '✅ ¡Eso es todo!',
          description: 'Ahora ya conoces tu impacto ambiental. Cada vez que reciclas, estos números mejoran. ¡Sigue así!',
          side: 'bottom',
        },
      },
    ],
  },
];

// Steps adicionales para trazabilidad (se agregan dinámicamente cuando navegas a un exhibidor)
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

