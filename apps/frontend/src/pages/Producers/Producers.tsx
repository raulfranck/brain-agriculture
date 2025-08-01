import React, { useState } from 'react';
import styled from 'styled-components';
import { Plus, Users } from 'lucide-react';
import { Button } from '../../components/atoms';
import { ProducerList } from '../../components/organisms/ProducerList/ProducerList';
import { ProducerForm } from '../../components/organisms/ProducerForm/ProducerForm';
import type { Producer } from '@libs/types';

const Container = styled.div`
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #111827;
`;

const Subtitle = styled.p`
  margin: 8px 0 0 0;
  font-size: 16px;
  color: #6b7280;
`;

export const Producers: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProducer, setEditingProducer] = useState<Producer | undefined>();

  const handleCreateProducer = () => {
    setEditingProducer(undefined);
    setShowForm(true);
  };

  const handleEditProducer = (producer: Producer) => {
    setEditingProducer(producer);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProducer(undefined);
  };

  const handleFormSuccess = () => {
    // O ProducerList será atualizado automaticamente via RTK Query
    console.log('Produtor salvo com sucesso!');
  };

  return (
    <Container>
      <Header>
        <TitleContainer>
          <Users size={32} color="#10b981" />
          <div>
            <Title>Produtores Rurais</Title>
            <Subtitle>Gerencie os produtores cadastrados no sistema</Subtitle>
          </div>
        </TitleContainer>
        <Button onClick={handleCreateProducer}>
          <Plus size={20} />
          Novo Produtor
        </Button>
      </Header>

      <ProducerList onEdit={handleEditProducer} />

      {showForm && (
        <ProducerForm
          producer={editingProducer}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </Container>
  );
}; 