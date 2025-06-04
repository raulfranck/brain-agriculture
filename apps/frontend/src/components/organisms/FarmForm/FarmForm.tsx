import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button, Input } from '../../atoms';
import { 
  useCreateFarmMutation, 
  useUpdateFarmMutation, 
  useGetProducersQuery,
  useGetCropsQuery,
  useGetHarvestsQuery,
  useCreateHarvestMutation,
  useDeleteHarvestMutation 
} from '../../../store/api';
import type { Farm, CreateFarmDto, UpdateFarmDto, Producer, Crop } from '@libs/types';

interface FarmFormProps {
  farm?: Farm;
  onClose: () => void;
  onSuccess: () => void;
}

interface HarvestData {
  id?: string;
  year: number;
  cropId: string;
  cropName?: string;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #111827;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;

  &:hover {
    color: #111827;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Section = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  background: #f9fafb;
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Select = styled.select<{ hasError?: boolean }>`
  padding: 12px 16px;
  border: 1px solid ${props => props.hasError ? '#ef4444' : '#d1d5db'};
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#ef4444' : '#10b981'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? '#fecaca' : '#d1fae5'};
  }

  &:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 14px;
  margin-top: 8px;
`;

const AreaInfo = styled.div`
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 12px;
  margin-top: 8px;
`;

const AreaCalculation = styled.div`
  font-size: 14px;
  color: #0369a1;
  margin-bottom: 4px;
`;

const AreaValidation = styled.div<{ isValid: boolean }>`
  font-size: 12px;
  color: ${props => props.isValid ? '#059669' : '#dc2626'};
  font-weight: 500;
`;

const HarvestContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const HarvestRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr auto;
  gap: 12px;
  align-items: end;
  padding: 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`;

const AddHarvestButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: #059669;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const RemoveButton = styled.button`
  padding: 8px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #dc2626;
  }
`;

const HarvestSummary = styled.div`
  margin-top: 16px;
  padding: 12px;
  background: #ecfdf5;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
`;

const SummaryTitle = styled.div`
  font-weight: 600;
  color: #065f46;
  margin-bottom: 8px;
`;

const SummaryList = styled.div`
  font-size: 14px;
  color: #064e3b;
`;

export const FarmForm: React.FC<FarmFormProps> = ({
  farm,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    state: '',
    totalArea: '',
    arableArea: '',
    vegetationArea: '',
    producerId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Estado para as safras
  const [harvests, setHarvests] = useState<HarvestData[]>([]);
  const [newHarvest, setNewHarvest] = useState({
    year: new Date().getFullYear(),
    cropId: '',
  });
  
  const { data: producers } = useGetProducersQuery();
  const { data: crops } = useGetCropsQuery();
  const { data: existingHarvests } = useGetHarvestsQuery(farm?.id, { skip: !farm?.id });
  const [createFarm, { isLoading: isCreating }] = useCreateFarmMutation();
  const [updateFarm, { isLoading: isUpdating }] = useUpdateFarmMutation();
  const [createHarvest] = useCreateHarvestMutation();
  const [deleteHarvest] = useDeleteHarvestMutation();

  const isEditing = !!farm;
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (farm) {
      setFormData({
        name: farm.name,
        city: farm.city,
        state: farm.state,
        totalArea: farm.totalArea.toString(),
        arableArea: farm.arableArea.toString(),
        vegetationArea: farm.vegetationArea.toString(),
        producerId: farm.producerId,
      });
    }
  }, [farm]);

  useEffect(() => {
    if (existingHarvests && crops) {
      const harvestsWithCropNames = existingHarvests.map(harvest => ({
        id: harvest.id,
        year: harvest.year,
        cropId: harvest.cropId,
        cropName: harvest.crop?.name || crops.find(c => c.id === harvest.cropId)?.name
      }));
      setHarvests(harvestsWithCropNames);
    }
  }, [existingHarvests, crops]);

  const calculateUsedArea = () => {
    const arable = parseFloat(formData.arableArea) || 0;
    const vegetation = parseFloat(formData.vegetationArea) || 0;
    return arable + vegetation;
  };

  const getTotalArea = () => parseFloat(formData.totalArea) || 0;

  const isAreaValid = () => {
    const usedArea = calculateUsedArea();
    const totalArea = getTotalArea();
    return usedArea <= totalArea;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome da fazenda é obrigatório';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Cidade é obrigatória';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'Estado é obrigatório';
    }

    if (!formData.producerId) {
      newErrors.producerId = 'Produtor é obrigatório';
    }

    const totalArea = parseFloat(formData.totalArea);
    if (!formData.totalArea.trim() || isNaN(totalArea) || totalArea <= 0) {
      newErrors.totalArea = 'Área total deve ser um número maior que zero';
    }

    const arableArea = parseFloat(formData.arableArea);
    if (!formData.arableArea.trim() || isNaN(arableArea) || arableArea < 0) {
      newErrors.arableArea = 'Área agricultável deve ser um número maior ou igual a zero';
    }

    const vegetationArea = parseFloat(formData.vegetationArea);
    if (!formData.vegetationArea.trim() || isNaN(vegetationArea) || vegetationArea < 0) {
      newErrors.vegetationArea = 'Área de vegetação deve ser um número maior ou igual a zero';
    }

    // Validar regra de negócio: área agricultável + vegetação <= área total
    if (!isAreaValid()) {
      newErrors.areas = 'A soma da área agricultável e vegetação não pode exceder a área total';
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
      const farmData = {
        name: formData.name,
        city: formData.city,
        state: formData.state,
        totalArea: parseFloat(formData.totalArea),
        arableArea: parseFloat(formData.arableArea),
        vegetationArea: parseFloat(formData.vegetationArea),
        producerId: formData.producerId,
      };

      let farmId: string;

      if (isEditing && farm) {
        const updateData: UpdateFarmDto = {
          name: farmData.name,
          city: farmData.city,
          state: farmData.state,
          totalArea: farmData.totalArea,
          arableArea: farmData.arableArea,
          vegetationArea: farmData.vegetationArea,
        };
        await updateFarm({ id: farm.id, updates: updateData }).unwrap();
        farmId = farm.id;
      } else {
        const createData: CreateFarmDto = farmData;
        const newFarm = await createFarm(createData).unwrap();
        farmId = newFarm.id;
      }

      // Salvar novas safras (apenas para fazendas novas ou safras adicionadas)
      if (!isEditing) {
        for (const harvest of harvests) {
          if (!harvest.id) {
            await createHarvest({
              year: harvest.year,
              farmId,
              cropId: harvest.cropId,
            }).unwrap();
          }
        }
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar fazenda:', error);
      setErrors({ submit: 'Erro ao salvar fazenda. Tente novamente.' });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Limpar erro de áreas se mudou alguma área
    if (['totalArea', 'arableArea', 'vegetationArea'].includes(field) && errors.areas) {
      setErrors(prev => ({ ...prev, areas: '' }));
    }
  };

  const addHarvest = async () => {
    if (!newHarvest.cropId) return;

    const crop = crops?.find(c => c.id === newHarvest.cropId);
    if (!crop) return;

    // Verificar se já existe esta combinação ano + cultura
    const exists = harvests.some(h => h.year === newHarvest.year && h.cropId === newHarvest.cropId);
    if (exists) {
      alert('Esta cultura já foi adicionada para este ano');
      return;
    }

    if (isEditing && farm) {
      // Se estamos editando, criar a safra diretamente no backend
      try {
        const newHarvestData = await createHarvest({
          year: newHarvest.year,
          farmId: farm.id,
          cropId: newHarvest.cropId,
        }).unwrap();

        setHarvests(prev => [...prev, {
          id: newHarvestData.id,
          year: newHarvest.year,
          cropId: newHarvest.cropId,
          cropName: crop.name,
        }]);
      } catch (error) {
        console.error('Erro ao adicionar safra:', error);
        alert('Erro ao adicionar safra');
        return;
      }
    } else {
      // Se é uma fazenda nova, adicionar à lista local
      setHarvests(prev => [...prev, {
        year: newHarvest.year,
        cropId: newHarvest.cropId,
        cropName: crop.name,
      }]);
    }

    setNewHarvest({
      year: new Date().getFullYear(),
      cropId: '',
    });
  };

  const removeHarvest = async (index: number) => {
    const harvest = harvests[index];
    
    if (harvest.id && isEditing) {
      // Se tem ID, deletar do backend
      try {
        await deleteHarvest(harvest.id).unwrap();
      } catch (error) {
        console.error('Erro ao remover safra:', error);
        alert('Erro ao remover safra');
        return;
      }
    }

    setHarvests(prev => prev.filter((_, i) => i !== index));
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getHarvestSummary = () => {
    const yearGroups = harvests.reduce((acc, harvest) => {
      if (!acc[harvest.year]) {
        acc[harvest.year] = [];
      }
      acc[harvest.year].push(harvest.cropName || 'Cultura desconhecida');
      return acc;
    }, {} as Record<number, string[]>);

    return Object.entries(yearGroups).map(([year, cropNames]) => ({
      year: parseInt(year),
      crops: cropNames,
    }));
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <Modal>
        <Header>
          <Title>{isEditing ? 'Editar Fazenda' : 'Nova Fazenda'}</Title>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          <Section>
            <SectionTitle>Informações Básicas</SectionTitle>
            
            <Input
              label="Nome da Fazenda"
              placeholder="Nome da propriedade"
              value={formData.name}
              onChange={(value) => handleChange('name', value)}
              error={errors.name}
              required
            />

            {!isEditing && (
              <SelectContainer>
                <Label>
                  Produtor <span style={{ color: '#ef4444' }}>*</span>
                </Label>
                <Select
                  value={formData.producerId}
                  onChange={(e) => handleChange('producerId', e.target.value)}
                  hasError={!!errors.producerId}
                  required
                >
                  <option value="">Selecione um produtor</option>
                  {producers?.map((producer) => (
                    <option key={producer.id} value={producer.id}>
                      {producer.name} - {producer.document}
                    </option>
                  ))}
                </Select>
                {errors.producerId && <ErrorMessage>{errors.producerId}</ErrorMessage>}
              </SelectContainer>
            )}

            <Input
              label="Cidade"
              placeholder="Cidade onde está localizada"
              value={formData.city}
              onChange={(value) => handleChange('city', value)}
              error={errors.city}
              required
            />

            <Input
              label="Estado"
              placeholder="SP, RJ, MG..."
              value={formData.state}
              onChange={(value) => handleChange('state', value)}
              error={errors.state}
              required
            />
          </Section>

          <Section>
            <SectionTitle>Áreas (hectares)</SectionTitle>
            
            <Input
              label="Área Total"
              placeholder="0.00"
              type="number"
              value={formData.totalArea}
              onChange={(value) => handleChange('totalArea', value)}
              error={errors.totalArea}
              required
            />

            <Input
              label="Área Agricultável"
              placeholder="0.00"
              type="number"
              value={formData.arableArea}
              onChange={(value) => handleChange('arableArea', value)}
              error={errors.arableArea}
              required
            />

            <Input
              label="Área de Vegetação"
              placeholder="0.00"
              type="number"
              value={formData.vegetationArea}
              onChange={(value) => handleChange('vegetationArea', value)}
              error={errors.vegetationArea}
              required
            />

            {(formData.totalArea || formData.arableArea || formData.vegetationArea) && (
              <AreaInfo>
                <AreaCalculation>
                  Área utilizada: {calculateUsedArea().toFixed(2)} / {getTotalArea().toFixed(2)} hectares
                </AreaCalculation>
                <AreaValidation isValid={isAreaValid()}>
                  {isAreaValid() 
                    ? '✓ Áreas dentro do limite permitido' 
                    : '⚠ Soma das áreas excede a área total'
                  }
                </AreaValidation>
              </AreaInfo>
            )}

            {errors.areas && <ErrorMessage>{errors.areas}</ErrorMessage>}
          </Section>

          <Section>
            <SectionTitle>Safras e Culturas</SectionTitle>
            
            <HarvestContainer>
              {/* Adicionar nova safra */}
              <HarvestRow>
                <Input
                  label="Ano"
                  type="number"
                  value={newHarvest.year.toString()}
                  onChange={(value) => setNewHarvest(prev => ({ ...prev, year: parseInt(value) || new Date().getFullYear() }))}
                />
                
                <SelectContainer>
                  <Label>Cultura</Label>
                  <Select
                    value={newHarvest.cropId}
                    onChange={(e) => setNewHarvest(prev => ({ ...prev, cropId: e.target.value }))}
                  >
                    <option value="">Selecione uma cultura</option>
                    {crops?.map((crop) => (
                      <option key={crop.id} value={crop.id}>
                        {crop.name}
                      </option>
                    ))}
                  </Select>
                </SelectContainer>

                <AddHarvestButton
                  type="button"
                  onClick={addHarvest}
                  disabled={!newHarvest.cropId}
                >
                  <Plus size={16} />
                  Adicionar
                </AddHarvestButton>
              </HarvestRow>

              {/* Lista de safras adicionadas */}
              {harvests.map((harvest, index) => (
                <HarvestRow key={`${harvest.year}-${harvest.cropId}-${index}`}>
                  <div>
                    <Label>Ano</Label>
                    <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '6px', fontWeight: '500' }}>
                      {harvest.year}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Cultura</Label>
                    <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '6px', fontWeight: '500' }}>
                      {harvest.cropName}
                    </div>
                  </div>

                  <RemoveButton
                    type="button"
                    onClick={() => removeHarvest(index)}
                  >
                    <Trash2 size={16} />
                  </RemoveButton>
                </HarvestRow>
              ))}
            </HarvestContainer>

            {harvests.length > 0 && (
              <HarvestSummary>
                <SummaryTitle>Resumo das Safras:</SummaryTitle>
                <SummaryList>
                  {getHarvestSummary().map(({ year, crops }) => (
                    <div key={year}>
                      <strong>{year}:</strong> {crops.join(', ')}
                    </div>
                  ))}
                </SummaryList>
              </HarvestSummary>
            )}
          </Section>

          {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}

          <ButtonGroup>
            <Button variant="secondary" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" loading={isLoading}>
              {isEditing ? 'Atualizar' : 'Criar'}
            </Button>
          </ButtonGroup>
        </Form>
      </Modal>
    </Overlay>
  );
}; 