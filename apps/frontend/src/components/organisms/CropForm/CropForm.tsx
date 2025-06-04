import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';
import { Button } from '../../atoms/Button/Button';
import { Input } from '../../atoms/Input/Input';
import { useCreateCropMutation, useUpdateCropMutation } from '../../../store/api';
import type { Crop } from '@libs/types/crop';

interface CropFormProps {
  crop?: Crop;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  color: #1a365d;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #718096;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background-color: #f7fafc;
    color: #1a365d;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TextareaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const Textarea = styled.textarea<{ hasError?: boolean }>`
  padding: 12px 16px;
  border: 1px solid ${props => props.hasError ? '#ef4444' : '#d1d5db'};
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease-in-out;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#ef4444' : '#10b981'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? '#fecaca' : '#d1fae5'};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const ErrorText = styled.span`
  font-size: 12px;
  color: #ef4444;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

export const CropForm: React.FC<CropFormProps> = ({ crop, onClose }) => {
  const [name, setName] = useState(crop?.name || '');
  const [description, setDescription] = useState(crop?.description || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [createCrop, { isLoading: isCreating }] = useCreateCropMutation();
  const [updateCrop, { isLoading: isUpdating }] = useUpdateCropMutation();

  const isEditing = !!crop;
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (crop) {
      setName(crop.name);
      setDescription(crop.description || '');
    }
  }, [crop]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Nome da cultura é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const cropData = {
        name: name.trim(),
        description: description.trim() || undefined,
      };

      if (isEditing) {
        await updateCrop({
          id: crop.id,
          updates: cropData,
        }).unwrap();
      } else {
        await createCrop(cropData).unwrap();
      }

      onClose();
    } catch (error: any) {
      console.error('Erro ao salvar cultura:', error);
      
      if (error?.data?.message?.includes('já existe')) {
        setErrors({ name: 'Uma cultura com este nome já existe' });
      } else {
        alert('Erro ao salvar cultura');
      }
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <Modal>
        <Header>
          <Title>{isEditing ? 'Editar Cultura' : 'Nova Cultura'}</Title>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          <Input
            label="Nome da Cultura"
            value={name}
            onChange={setName}
            error={errors.name}
            placeholder="Ex: Soja, Milho, Café..."
            required
          />

          <TextareaContainer>
            <Label>Descrição</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              hasError={!!errors.description}
              placeholder="Descrição opcional da cultura"
              rows={3}
            />
            {errors.description && <ErrorText>{errors.description}</ErrorText>}
          </TextareaContainer>

          <ButtonGroup>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              disabled={isLoading}
            >
              {isEditing ? 'Atualizar' : 'Criar'}
            </Button>
          </ButtonGroup>
        </Form>
      </Modal>
    </Overlay>
  );
}; 