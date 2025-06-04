import React, { useState } from 'react';
import styled from 'styled-components';
import { Trash2, Edit, MapPin, Ruler, Sprout } from 'lucide-react';
import { Card } from '../../molecules/Card/Card';
import { ConfirmModal } from '../../molecules/ConfirmModal/ConfirmModal';
import { Button } from '../../atoms';
import { useGetFarmsQuery, useDeleteFarmMutation, useGetHarvestsQuery } from '../../../store/api';
import { useToastContext } from '../../../contexts/ToastContext';
import type { Farm } from '@libs/types';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
`;

const FarmCard = styled(Card)`
  position: relative;
`;

const FarmHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const FarmName = styled.h4`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
`;

const ProducerInfo = styled.p`
  margin: 4px 0;
  font-size: 14px;
  color: #6b7280;
`;

const LocationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 8px 0;
`;

const LocationText = styled.span`
  font-size: 14px;
  color: #6b7280;
`;

const AreaContainer = styled.div`
  margin: 12px 0;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
`;

const AreaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 4px 0;
  font-size: 14px;
`;

const AreaLabel = styled.span`
  color: #6b7280;
`;

const AreaValue = styled.span<{ highlight?: boolean }>`
  font-weight: 500;
  color: ${props => props.highlight ? '#10b981' : '#111827'};
`;

const AreaUsage = styled.div`
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #e5e7eb;
`;

const UsageBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin: 4px 0;
`;

const UsageProgress = styled.div<{ percentage: number; isOverLimit: boolean }>`
  height: 100%;
  width: ${props => Math.min(props.percentage, 100)}%;
  background: ${props => props.isOverLimit ? '#ef4444' : '#10b981'};
  transition: all 0.3s ease;
`;

const UsageText = styled.div<{ isOverLimit: boolean }>`
  font-size: 12px;
  color: ${props => props.isOverLimit ? '#ef4444' : '#6b7280'};
  text-align: center;
`;

const HarvestContainer = styled.div`
  margin: 12px 0;
  padding: 12px;
  background: #ecfdf5;
  border-radius: 8px;
  border: 1px solid #bbf7d0;
`;

const HarvestHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #065f46;
`;

const HarvestList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const HarvestItem = styled.div`
  font-size: 13px;
  color: #064e3b;
  display: flex;
  justify-content: space-between;
`;

const HarvestYear = styled.span`
  font-weight: 500;
`;

const HarvestCrops = styled.span`
  color: #047857;
`;

const NoHarvests = styled.div`
  font-size: 13px;
  color: #6b7280;
  font-style: italic;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 16px;
  color: #6b7280;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 16px;
  color: #ef4444;
`;

interface FarmListProps {
  onEdit?: (farm: Farm) => void;
}

interface FarmCardWithHarvestsProps {
  farm: Farm;
  onEdit?: (farm: Farm) => void;
  onDelete: (farm: Farm) => void;
}

const FarmCardWithHarvests: React.FC<FarmCardWithHarvestsProps> = ({ farm, onEdit, onDelete }) => {
  const { data: harvests } = useGetHarvestsQuery(farm.id);

  const calculateAreaUsage = (farm: Farm) => {
    const usedArea = farm.arableArea + farm.vegetationArea;
    const percentage = (usedArea / farm.totalArea) * 100;
    const isOverLimit = usedArea > farm.totalArea;
    
    return { usedArea, percentage, isOverLimit };
  };

  const getHarvestSummary = () => {
    if (!harvests || harvests.length === 0) return null;

    const yearGroups = harvests.reduce((acc, harvest) => {
      if (!acc[harvest.year]) {
        acc[harvest.year] = [];
      }
      acc[harvest.year].push(harvest.crop?.name || 'Cultura desconhecida');
      return acc;
    }, {} as Record<number, string[]>);

    return Object.entries(yearGroups)
      .sort(([a], [b]) => parseInt(b) - parseInt(a)) // Ordenar por ano decrescente
      .map(([year, crops]) => ({
        year: parseInt(year),
        crops: crops.join(', '),
      }));
  };

  const { usedArea, percentage, isOverLimit } = calculateAreaUsage(farm);
  const harvestSummary = getHarvestSummary();

  return (
    <FarmCard>
      <FarmHeader>
        <div>
          <FarmName>{farm.name}</FarmName>
          {farm.producer && (
            <ProducerInfo>{farm.producer.name}</ProducerInfo>
          )}
        </div>
      </FarmHeader>

      <LocationContainer>
        <MapPin size={16} />
        <LocationText>
          {farm.city}, {farm.state}
        </LocationText>
      </LocationContainer>

      <AreaContainer>
        <AreaRow>
          <AreaLabel>
            <Ruler size={14} style={{ marginRight: '4px' }} />
            Área Total:
          </AreaLabel>
          <AreaValue highlight>{farm.totalArea.toFixed(2)} ha</AreaValue>
        </AreaRow>
        
        <AreaRow>
          <AreaLabel>Área Agricultável:</AreaLabel>
          <AreaValue>{farm.arableArea.toFixed(2)} ha</AreaValue>
        </AreaRow>
        
        <AreaRow>
          <AreaLabel>Área de Vegetação:</AreaLabel>
          <AreaValue>{farm.vegetationArea.toFixed(2)} ha</AreaValue>
        </AreaRow>

        <AreaUsage>
          <UsageBar>
            <UsageProgress percentage={percentage} isOverLimit={isOverLimit} />
          </UsageBar>
          <UsageText isOverLimit={isOverLimit}>
            {usedArea.toFixed(2)} ha utilizados ({percentage.toFixed(1)}%)
            {isOverLimit && ' - Excede limite!'}
          </UsageText>
        </AreaUsage>
      </AreaContainer>

      <HarvestContainer>
        <HarvestHeader>
          <Sprout size={16} />
          Safras e Culturas
        </HarvestHeader>
        <HarvestList>
          {harvestSummary && harvestSummary.length > 0 ? (
            harvestSummary.map(({ year, crops }) => (
              <HarvestItem key={year}>
                <HarvestYear>{year}:</HarvestYear>
                <HarvestCrops>{crops}</HarvestCrops>
              </HarvestItem>
            ))
          ) : (
            <NoHarvests>Nenhuma safra cadastrada</NoHarvests>
          )}
        </HarvestList>
      </HarvestContainer>

      <ActionsContainer>
        {onEdit && (
          <Button
            variant="secondary"
            size="small"
            onClick={() => onEdit(farm)}
          >
            <Edit size={16} />
            Editar
          </Button>
        )}
        <Button
          variant="danger"
          size="small"
          onClick={() => onDelete(farm)}
        >
          <Trash2 size={16} />
          Excluir
        </Button>
      </ActionsContainer>
    </FarmCard>
  );
};

export const FarmList: React.FC<FarmListProps> = ({ onEdit }) => {
  const { data: farms, isLoading, error } = useGetFarmsQuery();
  const [deleteFarm] = useDeleteFarmMutation();
  const { success, error: showError } = useToastContext();
  
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    farmId?: string;
    farmName?: string;
  }>({
    isOpen: false,
  });

  const handleDeleteClick = (farm: Farm) => {
    setConfirmModal({
      isOpen: true,
      farmId: farm.id,
      farmName: farm.name,
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmModal.farmId) return;

    try {
      await deleteFarm(confirmModal.farmId).unwrap();
      success(`Fazenda ${confirmModal.farmName} excluída com sucesso!`);
      setConfirmModal({ isOpen: false });
    } catch (error) {
      console.error('Erro ao excluir fazenda:', error);
      showError('Erro ao excluir fazenda. Tente novamente.');
      setConfirmModal({ isOpen: false });
    }
  };

  if (isLoading) {
    return <LoadingContainer>Carregando fazendas...</LoadingContainer>;
  }

  if (error) {
    return <ErrorContainer>Erro ao carregar fazendas</ErrorContainer>;
  }

  if (!farms || farms.length === 0) {
    return <LoadingContainer>Nenhuma fazenda encontrada</LoadingContainer>;
  }

  return (
    <>
      <Container>
        {farms.map((farm) => (
          <FarmCardWithHarvests
            key={farm.id}
            farm={farm}
            onEdit={onEdit}
            onDelete={handleDeleteClick}
          />
        ))}
      </Container>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onCancel={() => setConfirmModal({ isOpen: false })}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir a fazenda "${confirmModal.farmName}"?`}
        variant="danger"
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </>
  );
}; 