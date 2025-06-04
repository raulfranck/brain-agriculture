import React, { useState } from 'react';
import styled from 'styled-components';
import { Edit2, Trash2 } from 'lucide-react';
import { Card } from '../../molecules/Card/Card';
import { ConfirmModal } from '../../molecules/ConfirmModal/ConfirmModal';
import { Button } from '../../atoms/Button/Button';
import { useGetCropsQuery, useDeleteCropMutation } from '../../../store/api';
import { useToastContext } from '../../../contexts/ToastContext';
import { CropForm } from '../CropForm/CropForm';
import type { Crop } from '@libs/types/crop';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const CropCard = styled(Card)`
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const CropHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const CropTitle = styled.h3`
  color: #1a365d;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`;

const CropDescription = styled.p`
  color: #4a5568;
  margin: 0.5rem 0 1rem 0;
  font-size: 0.875rem;
  line-height: 1.4;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #4a5568;
  font-size: 1.125rem;
  padding: 2rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #e53e3e;
  font-size: 1.125rem;
  padding: 2rem;
`;

export const CropList: React.FC = () => {
  const { data: crops, isLoading, error } = useGetCropsQuery();
  const [deleteCrop] = useDeleteCropMutation();
  const { success, error: showError } = useToastContext();
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    cropId?: string;
    cropName?: string;
  }>({
    isOpen: false,
  });

  const handleDeleteClick = (crop: Crop) => {
    setConfirmModal({
      isOpen: true,
      cropId: crop.id,
      cropName: crop.name,
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmModal.cropId) return;

    try {
      await deleteCrop(confirmModal.cropId).unwrap();
      success(`Cultura ${confirmModal.cropName} excluída com sucesso!`);
      setConfirmModal({ isOpen: false });
    } catch (error: any) {
      console.error('Erro ao excluir cultura:', error);
      // Verificar se é erro de cultura em uso
      if (error?.data?.message?.includes('cultura está sendo utilizada') || 
          error?.data?.message?.includes('being used')) {
        showError('Não é possível excluir esta cultura pois ela está sendo utilizada em fazendas.');
      } else {
        showError('Erro ao excluir cultura. Tente novamente.');
      }
      setConfirmModal({ isOpen: false });
    }
  };

  if (isLoading) {
    return <LoadingMessage>Carregando culturas...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>Erro ao carregar culturas</ErrorMessage>;
  }

  if (!crops || crops.length === 0) {
    return <LoadingMessage>Nenhuma cultura encontrada</LoadingMessage>;
  }

  return (
    <>
      <Grid>
        {crops.map((crop) => (
          <CropCard key={crop.id}>
            <CropHeader>
              <CropTitle>{crop.name}</CropTitle>
              <Actions>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setEditingCrop(crop)}
                  icon={<Edit2 size={16} />}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => handleDeleteClick(crop)}
                  icon={<Trash2 size={16} />}
                >
                  Excluir
                </Button>
              </Actions>
            </CropHeader>
            {crop.description && (
              <CropDescription>{crop.description}</CropDescription>
            )}
          </CropCard>
        ))}
      </Grid>

      {editingCrop && (
        <CropForm
          crop={editingCrop}
          onClose={() => setEditingCrop(null)}
        />
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onCancel={() => setConfirmModal({ isOpen: false })}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir a cultura "${confirmModal.cropName}"?`}
        variant="danger"
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </>
  );
}; 