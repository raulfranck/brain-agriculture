import React, { useState } from 'react';
import styled from 'styled-components';
import { Trash2, Edit, MapPin } from 'lucide-react';
import { Card } from '../../molecules/Card/Card';
import { ConfirmModal } from '../../molecules/ConfirmModal/ConfirmModal';
import { Button } from '../../atoms';
import { useGetProducersQuery, useDeleteProducerMutation } from '../../../store/api';
import { useToastContext } from '../../../contexts/ToastContext';
import type { Producer } from '@libs/types';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const ProducerCard = styled(Card)`
  position: relative;
`;

const ProducerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const ProducerName = styled.h4`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
`;

const ProducerDocument = styled.p`
  margin: 4px 0;
  font-size: 14px;
  color: #6b7280;
  font-family: monospace;
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

const ActionsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

const FarmCount = styled.div`
  font-size: 12px;
  color: #10b981;
  font-weight: 500;
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

interface ProducerListProps {
  onEdit?: (producer: Producer) => void;
}

export const ProducerList: React.FC<ProducerListProps> = ({ onEdit }) => {
  const { data: producers, isLoading, error } = useGetProducersQuery();
  const [deleteProducer] = useDeleteProducerMutation();
  const { success, error: showError } = useToastContext();
  
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    producerId?: string;
    producerName?: string;
    farmCount?: number;
  }>({
    isOpen: false,
  });

  const handleDeleteClick = (producer: Producer) => {
    setConfirmModal({
      isOpen: true,
      producerId: producer.id,
      producerName: producer.name,
      farmCount: producer.farms?.length || 0,
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmModal.producerId) return;

    try {
      await deleteProducer(confirmModal.producerId).unwrap();
      success(`Produtor ${confirmModal.producerName} excluído com sucesso!`);
      setConfirmModal({ isOpen: false });
    } catch (error) {
      console.error('Erro ao excluir produtor:', error);
      showError('Erro ao excluir produtor. Tente novamente.');
      setConfirmModal({ isOpen: false });
    }
  };

  if (isLoading) {
    return <LoadingContainer>Carregando produtores...</LoadingContainer>;
  }

  if (error) {
    return <ErrorContainer>Erro ao carregar produtores</ErrorContainer>;
  }

  if (!producers || producers.length === 0) {
    return <LoadingContainer>Nenhum produtor encontrado</LoadingContainer>;
  }

  return (
    <>
      <Container>
        {producers.map((producer) => (
          <ProducerCard key={producer.id}>
            <ProducerHeader>
              <div>
                <ProducerName>{producer.name}</ProducerName>
                <ProducerDocument>{producer.document}</ProducerDocument>
              </div>
            </ProducerHeader>

            <LocationContainer>
              <MapPin size={16} />
              <LocationText>
                {producer.city}, {producer.state}
              </LocationText>
            </LocationContainer>

            {producer.farms && (
              <FarmCount>
                {producer.farms.length} fazenda{producer.farms.length !== 1 ? 's' : ''}
              </FarmCount>
            )}

            <ActionsContainer>
              {onEdit && (
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => onEdit(producer)}
                >
                  <Edit size={16} />
                  Editar
                </Button>
              )}
              <Button
                variant="danger"
                size="small"
                onClick={() => handleDeleteClick(producer)}
              >
                <Trash2 size={16} />
                Excluir
              </Button>
            </ActionsContainer>
          </ProducerCard>
        ))}
      </Container>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onCancel={() => setConfirmModal({ isOpen: false })}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message={
          confirmModal.farmCount && confirmModal.farmCount > 0
            ? `Tem certeza que deseja excluir o produtor "${confirmModal.producerName}"?\n\nAo excluir este produtor, ${confirmModal.farmCount} fazenda${confirmModal.farmCount !== 1 ? 's' : ''} também será${confirmModal.farmCount !== 1 ? 'ão' : ''} excluída${confirmModal.farmCount !== 1 ? 's' : ''}.`
            : `Tem certeza que deseja excluir o produtor "${confirmModal.producerName}"?`
        }
        variant="danger"
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </>
  );
}; 