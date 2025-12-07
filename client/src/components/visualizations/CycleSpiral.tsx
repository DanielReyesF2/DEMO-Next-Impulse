import { useState, useMemo } from 'react';
import { GraphicCycle } from '@/data/mockExhibitors';

interface CycleSpiralProps {
  cycles: GraphicCycle[];
  onCycleSelect: (cycle: GraphicCycle) => void;
  selectedCycleNumber?: number;
}

export function CycleSpiral({ cycles, onCycleSelect, selectedCycleNumber }: CycleSpiralProps) {
  const [hoveredCycle, setHoveredCycle] = useState<GraphicCycle | null>(null);
  
  const sortedCycles = useMemo(() => 
    [...cycles].sort((a, b) => a.cycleNumber - b.cycleNumber),
    [cycles]
  );

  // Espiral Arquímedes - distribución uniforme y elegante
  const spiralPoints = useMemo(() => {
    const points: { x: number; y: number; cycle: GraphicCycle }[] = [];
    const centerX = 200;
    const centerY = 200;
    const startRadius = 32;
    const maxRadius = 165;
    const totalAngle = 4.5 * Math.PI; // ~2.25 vueltas
    
    sortedCycles.forEach((cycle, index) => {
      const t = index / (sortedCycles.length - 1); // 0 a 1
      const angle = t * totalAngle - Math.PI / 2; // Empezar arriba
      const radius = startRadius + t * (maxRadius - startRadius);
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      points.push({ x, y, cycle });
    });
    
    return points;
  }, [sortedCycles]);

  const getColor = (cycle: GraphicCycle) => {
    if (cycle.endDate === null) return '#F59E0B';
    if (cycle.recycledInto === 'exhibitor') return '#6366F1';
    return '#059669';
  };

  return (
    <div className="relative">
      <svg viewBox="0 0 400 400" className="w-full max-w-md mx-auto">
        {/* Fondo limpio */}
        <rect x="0" y="0" width="400" height="400" fill="white" />
        
        {/* Línea de conexión continua y suave */}
        <path
          d={spiralPoints.length > 1 
            ? `M ${spiralPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`
            : ''
          }
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Nodos */}
        {spiralPoints.map((point) => {
          const cycle = point.cycle;
          const isSelected = selectedCycleNumber === cycle.cycleNumber;
          const isHovered = hoveredCycle?.cycleNumber === cycle.cycleNumber;
          const isActive = cycle.endDate === null;
          
          const baseSize = isActive ? 13 : 10;
          const size = isSelected || isHovered ? baseSize + 3 : baseSize;
          
          return (
            <g 
              key={cycle.lotId}
              className="cursor-pointer"
              onClick={() => onCycleSelect(cycle)}
              onMouseEnter={() => setHoveredCycle(cycle)}
              onMouseLeave={() => setHoveredCycle(null)}
            >
              {/* Ring para hover/selección */}
              {(isSelected || isHovered) && (
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={size + 4}
                  fill="none"
                  stroke={getColor(cycle)}
                  strokeWidth="2"
                  opacity="0.3"
                />
              )}
              
              {/* Nodo principal */}
              <circle
                cx={point.x}
                cy={point.y}
                r={size}
                fill={getColor(cycle)}
              />
              
              {/* Número del ciclo */}
              <text
                x={point.x}
                y={point.y + 0.5}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize={size > 11 ? "10" : "8"}
                fontWeight="500"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                {cycle.cycleNumber}
              </text>
            </g>
          );
        })}

        {/* Centro - Imagen de residuos gráficos (origen) */}
        <g>
          <defs>
            <clipPath id="centerCircle">
              <circle cx="200" cy="200" r="28" />
            </clipPath>
          </defs>
          <circle cx="200" cy="200" r="30" fill="white" stroke="#F59E0B" strokeWidth="2" />
          <image
            href="/images/residuos-graficos.png"
            x="172"
            y="172"
            width="56"
            height="56"
            clipPath="url(#centerCircle)"
            preserveAspectRatio="xMidYMid slice"
          />
          <circle cx="200" cy="200" r="28" fill="none" stroke="white" strokeWidth="2" opacity="0.5" />
        </g>
      </svg>

      {/* Leyenda compacta */}
      <div className="flex justify-center gap-4 mt-2">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
          <span className="text-[10px] text-gray-400">Gráficos</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
          <span className="text-[10px] text-gray-400">Exhibidores</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          <span className="text-[10px] text-gray-400">Activo</span>
        </div>
      </div>

      {/* Tooltip elegante */}
      {hoveredCycle && (
        <div 
          className="absolute bg-white rounded-lg shadow-lg border border-gray-100 px-4 py-3 min-w-[200px] z-20"
          style={{ 
            left: '50%', 
            transform: 'translateX(-50%)',
            bottom: '0px'
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: getColor(hoveredCycle) }}
              />
              <span className="text-sm font-medium text-gray-900">Ciclo {hoveredCycle.cycleNumber}</span>
            </div>
            <span className="text-[10px] text-gray-400 font-mono">{hoveredCycle.lotId}</span>
          </div>
          <div className="text-sm text-gray-600">{hoveredCycle.campaign}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">
            {hoveredCycle.startDate} → {hoveredCycle.endDate || 'En curso'}
          </div>
          {hoveredCycle.recycledInto && (
            <div className="text-[11px] text-gray-500 mt-2 pt-2 border-t border-gray-100">
              {hoveredCycle.materialSent} kg → {hoveredCycle.recycledInto === 'graphic' ? 'Nuevos gráficos' : 'Nuevo exhibidor'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
