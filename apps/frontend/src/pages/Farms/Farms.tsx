import React, { useState } from 'react';
import styled from 'styled-components';
import { Plus, Truck } from 'lucide-react';
import { Button } from '../../components/atoms';
import { FarmList } from '../../components/organisms/FarmList/FarmList';
import { FarmForm } from '../../components/organisms/FarmForm/FarmForm';
import type { Farm } from '@libs/types';

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

export const Farms: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | undefined>();

  const handleCreateFarm = () => {
    setEditingFarm(undefined);
    setShowForm(true);
  };

  const handleEditFarm = (farm: Farm) => {
    setEditingFarm(farm);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingFarm(undefined);
  };

  const handleFormSuccess = () => {
    // O FarmList será atualizado automaticamente via RTK Query
    console.log('Fazenda salva com sucesso!');
  };

  return (
    <Container>
      <Header>
        <TitleContainer>
          <Truck size={32} color="#10b981" />
          <div>
            <Title>Fazendas</Title>
            <Subtitle>Gerencie as propriedades rurais cadastradas</Subtitle>
          </div>
        </TitleContainer>
        <Button onClick={handleCreateFarm}>
          <Plus size={20} />
          Nova Fazenda
        </Button>
      </Header>

      <FarmList onEdit={handleEditFarm} />

      {showForm && (
        <FarmForm
          farm={editingFarm}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </Container>
  );
}; 