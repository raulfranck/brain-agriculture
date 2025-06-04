import React, { useState } from 'react';
import styled from 'styled-components';
import { Plus } from 'lucide-react';
import { Button } from '../../atoms/Button/Button';
import { CropList } from '../../organisms/CropList/CropList';
import { CropForm } from '../../organisms/CropForm/CropForm';

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #1a365d;
  font-size: 2rem;
  font-weight: 600;
`;

export const Crops: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <Container>
      <Header>
        <Title>Culturas</Title>
        <Button 
          onClick={() => setIsFormOpen(true)}
          icon={<Plus size={20} />}
        >
          Nova Cultura
        </Button>
      </Header>

      <CropList />

      {isFormOpen && (
        <CropForm
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </Container>
  );
}; 