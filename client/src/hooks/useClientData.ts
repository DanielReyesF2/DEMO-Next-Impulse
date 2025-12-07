import { useMemo } from 'react';
import { allLots, CURRENT_CLIENT } from '@/data/mockLots';
import { Lot } from '@shared/types';

interface ClientMetrics {
  totalLots: number;
  activeLots: number;
  totalCycles: number;
  totalEmissionsAvoided: number;
  totalPlasticRecycled: number;
  totalKm: number;
  avgCyclesPerLot: number;
}

export function useClientData() {
  const clientLots = useMemo(() => {
    return allLots.filter(lot => lot.clientOwner === CURRENT_CLIENT.name);
  }, []);

  const metrics = useMemo((): ClientMetrics => {
    const totalLots = clientLots.length;
    const activeLots = clientLots.filter(l => l.status === 'active').length;
    const totalCycles = clientLots.reduce((sum, lot) => sum + lot.totalCycles, 0);
    const totalEmissionsAvoided = clientLots.reduce((sum, lot) => sum + lot.totalEmissionsAvoided, 0);
    const totalPlasticRecycled = clientLots.reduce((sum, lot) => sum + lot.totalPlasticRecycled, 0);
    const totalKm = clientLots.reduce((sum, lot) => {
      return sum + lot.cycles.reduce((s, c) => s + c.distance, 0);
    }, 0);
    const avgCyclesPerLot = totalLots > 0 ? totalCycles / totalLots : 0;

    return {
      totalLots,
      activeLots,
      totalCycles,
      totalEmissionsAvoided,
      totalPlasticRecycled,
      totalKm,
      avgCyclesPerLot
    };
  }, [clientLots]);

  return {
    currentClient: CURRENT_CLIENT,
    lots: clientLots,
    metrics
  };
}

