import React from 'react';
import styled from 'styled-components';
import { Plus } from 'lucide-react';
import { Button } from '../../components/atoms';
import { ProducerList } from '../../components/organisms/ProducerList/ProducerList';
import type { Producer } from '@libs/types';

const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #111827;
`;

export const Producers: React.FC = () => {
  const handleNewProducer = () => {
    // TODO: Implementar modal/formulário de novo produtor
    console.log('Criar novo produtor');
  };

  const handleEditProducer = (producer: Producer) => {
    // TODO: Implementar modal/formulário de edição
    console.log('Editar produtor:', producer);
  };

  return (
    <Container>
      <Header>
        <Title>Produtores Rurais</Title>
        <Button onClick={handleNewProducer}>
          <Plus size={16} />
          Novo Produtor
        </Button>
      </Header>

      <ProducerList onEdit={handleEditProducer} />
    </Container>
  );
}; 