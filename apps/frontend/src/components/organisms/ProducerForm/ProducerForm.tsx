import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';
import { Button, Input } from '../../atoms';
import { useCreateProducerMutation, useUpdateProducerMutation } from '../../../store/api';
import type { Producer, CreateProducerDto, UpdateProducerDto } from '@libs/types';

interface ProducerFormProps {
  producer?: Producer;
  onClose: () => void;
  onSuccess: () => void;
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
  max-width: 500px;
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

// Função para validar CPF
const validateCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf[i]) * (10 - i);
  }
  let digit1 = 11 - (sum % 11);
  if (digit1 >= 10) digit1 = 0;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf[i]) * (11 - i);
  }
  let digit2 = 11 - (sum % 11);
  if (digit2 >= 10) digit2 = 0;

  return digit1 === parseInt(cpf[9]) && digit2 === parseInt(cpf[10]);
};

// Função para validar CNPJ
const validateCNPJ = (cnpj: string): boolean => {
  cnpj = cnpj.replace(/[^\d]/g, '');
  
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
    return false;
  }

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 7, 8, 9, 2, 3, 4, 5, 6, 7, 8, 9];

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj[i]) * weights1[i];
  }
  let digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpj[i]) * weights2[i];
  }
  let digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  return digit1 === parseInt(cnpj[12]) && digit2 === parseInt(cnpj[13]);
};

// Função para validar documento (CPF ou CNPJ)
const validateDocument = (document: string): string | null => {
  const clean = document.replace(/[^\d]/g, '');
  
  if (clean.length === 11) {
    return validateCPF(clean) ? null : 'CPF inválido';
  } else if (clean.length === 14) {
    return validateCNPJ(clean) ? null : 'CNPJ inválido';
  } else {
    return 'Documento deve ter 11 dígitos (CPF) ou 14 dígitos (CNPJ)';
  }
};

export const ProducerForm: React.FC<ProducerFormProps> = ({
  producer,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    document: '',
    city: '',
    state: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [createProducer, { isLoading: isCreating }] = useCreateProducerMutation();
  const [updateProducer, { isLoading: isUpdating }] = useUpdateProducerMutation();

  const isEditing = !!producer;
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (producer) {
      setFormData({
        name: producer.name,
        document: producer.document,
        city: producer.city,
        state: producer.state,
      });
    }
  }, [producer]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.document.trim()) {
      newErrors.document = 'Documento é obrigatório';
    } else {
      const documentError = validateDocument(formData.document);
      if (documentError) {
        newErrors.document = documentError;
      }
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Cidade é obrigatória';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'Estado é obrigatório';
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
      const cleanDocument = formData.document.replace(/[^\d]/g, '');
      
      if (isEditing && producer) {
        const updateData: UpdateProducerDto = {
          name: formData.name,
          document: cleanDocument,
          city: formData.city,
          state: formData.state,
        };
        await updateProducer({ id: producer.id, updates: updateData }).unwrap();
      } else {
        const createData: CreateProducerDto = {
          name: formData.name,
          document: cleanDocument,
          city: formData.city,
          state: formData.state,
        };
        await createProducer(createData).unwrap();
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar produtor:', error);
      setErrors({ submit: 'Erro ao salvar produtor. Tente novamente.' });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
          <Title>{isEditing ? 'Editar Produtor' : 'Novo Produtor'}</Title>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          <Input
            label="Nome"
            placeholder="Nome completo do produtor"
            value={formData.name}
            onChange={(value) => handleChange('name', value)}
            error={errors.name}
            required
          />

          <Input
            label="CPF/CNPJ"
            placeholder="00000000000 ou 00000000000000"
            value={formData.document}
            onChange={(value) => handleChange('document', value)}
            error={errors.document}
            required
          />

          <Input
            label="Cidade"
            placeholder="Cidade onde está localizado"
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