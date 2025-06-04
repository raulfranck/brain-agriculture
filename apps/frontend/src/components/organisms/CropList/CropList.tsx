import React, { useState } from 'react';
import styled from 'styled-components';
import { Edit2, Trash2 } from 'lucide-react';
import { Card } from '../../molecules/Card/Card';
import { Button } from '../../atoms/Button/Button';
import { useGetCropsQuery, useDeleteCropMutation } from '../../../store/api';
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
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta cultura?')) {
      try {
        await deleteCrop(id).unwrap();
      } catch (error) {
        console.error('Erro ao excluir cultura:', error);
        alert('Erro ao excluir cultura');
      }
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
                  onClick={() => handleDelete(crop.id)}
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
    </>
  );
}; 