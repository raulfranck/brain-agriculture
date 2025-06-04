import { useMemo } from 'react';
import { useGetFarmsQuery, useGetHarvestsQuery } from '../store/api';
import type { Harvest } from '@libs/types/crop';

export interface DashboardStats {
  totalFarms: number;
  totalHectares: number;
  stateDistribution: { name: string; value: number; percentage: number }[];
  cropDistribution: { name: string; value: number; percentage: number }[];
  landUseDistribution: { name: string; value: number; percentage: number }[];
}

export const useDashboardStats = (producerId?: string): { 
  stats: DashboardStats | null; 
  isLoading: boolean; 
  error: any;
} => {
  const { data: farms, isLoading: farmsLoading, error: farmsError } = useGetFarmsQuery();
  const { data: allHarvests, isLoading: harvestsLoading, error: harvestsError } = useGetHarvestsQuery();

  const stats = useMemo((): DashboardStats | null => {
    if (!farms) return null;

    // Filtrar fazendas por produtor se especificado
    const filteredFarms = producerId 
      ? farms.filter(farm => farm.producerId === producerId)
      : farms;

    // Filtrar safras pelas fazendas filtradas
    const filteredHarvests = allHarvests?.filter(harvest => 
      filteredFarms.some(farm => farm.id === harvest.farmId)
    ) || [];

    const totalFarms = filteredFarms.length;
    const totalHectares = filteredFarms.reduce((sum, farm) => sum + farm.totalArea, 0);

    // Distribuição por estado
    const stateCount = filteredFarms.reduce((acc, farm) => {
      acc[farm.state] = (acc[farm.state] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const stateDistribution = Object.entries(stateCount).map(([name, value]) => ({
      name,
      value,
      percentage: (value / totalFarms) * 100,
    }));

    // Distribuição por cultura (das safras) - CORRIGIDO
    const cropCount = filteredHarvests.reduce((acc: Record<string, number>, harvest: Harvest) => {
      const cropName = harvest.crop?.name || 'Desconhecida';
      acc[cropName] = (acc[cropName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalHarvests = filteredHarvests.length;
    const cropDistribution = Object.entries(cropCount).map(([name, value]) => ({
      name,
      value: value as number,
      percentage: totalHarvests > 0 ? ((value as number) / totalHarvests) * 100 : 0,
    }));

    // Distribuição de uso do solo
    const totalArableArea = filteredFarms.reduce((sum, farm) => sum + farm.arableArea, 0);
    const totalVegetationArea = filteredFarms.reduce((sum, farm) => sum + farm.vegetationArea, 0);
    const unusedArea = totalHectares - totalArableArea - totalVegetationArea;

    const landUseDistribution = [
      {
        name: 'Área Agricultável',
        value: totalArableArea,
        percentage: totalHectares > 0 ? (totalArableArea / totalHectares) * 100 : 0,
      },
      {
        name: 'Vegetação',
        value: totalVegetationArea,
        percentage: totalHectares > 0 ? (totalVegetationArea / totalHectares) * 100 : 0,
      },
      {
        name: 'Não Utilizada',
        value: Math.max(0, unusedArea),
        percentage: totalHectares > 0 ? (Math.max(0, unusedArea) / totalHectares) * 100 : 0,
      },
    ].filter(item => item.value > 0);

    return {
      totalFarms,
      totalHectares,
      stateDistribution: stateDistribution.sort((a, b) => b.value - a.value),
      cropDistribution: cropDistribution.sort((a, b) => b.value - a.value),
      landUseDistribution,
    };
  }, [farms, allHarvests, producerId]);

  return {
    stats,
    isLoading: farmsLoading || harvestsLoading,
    error: farmsError || harvestsError,
  };
}; 