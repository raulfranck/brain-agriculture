import React, { useState } from 'react';
import styled from 'styled-components';
import { BarChart3, Tractor, MapPin, Sprout, Users } from 'lucide-react';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useGetProducersQuery } from '../../store/api';
import { StatsCard } from '../../components/organisms/StatsCard/StatsCard';
import { PieChart } from '../../components/organisms/PieChart/PieChart';

const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  color: #111827;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 16px;
  color: #6b7280;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 250px;
`;

const FilterLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: border-color 0.2s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px #d1fae5;
  }
`;

const CurrentFilter = styled.div`
  font-size: 12px;
  color: #6b7280;
  font-style: italic;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 18px;
  color: #6b7280;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 18px;
  color: #ef4444;
  text-align: center;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #6b7280;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
`;

const EmptyDescription = styled.p`
  margin: 0;
  font-size: 14px;
  max-width: 300px;
`;

export const Dashboard: React.FC = () => {
  const [selectedProducerId, setSelectedProducerId] = useState<string>('');
  const { data: producers } = useGetProducersQuery();
  const { stats, isLoading, error } = useDashboardStats(selectedProducerId || undefined);

  const formatHectares = (value: number) => `${value.toFixed(1)} ha`;

  const selectedProducer = producers?.find(p => p.id === selectedProducerId);
  const isFiltered = !!selectedProducerId;

  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <BarChart3 size={48} />
          <div style={{ marginLeft: '16px' }}>Carregando estatísticas...</div>
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorContainer>
          <div>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <div>Erro ao carregar estatísticas</div>
            <div style={{ fontSize: '14px', marginTop: '8px' }}>
              Tente recarregar a página
            </div>
          </div>
        </ErrorContainer>
      </Container>
    );
  }

  if (!stats || stats.totalFarms === 0) {
    return (
      <Container>
        <Header>
          <HeaderTop>
            <HeaderContent>
              <Title>Dashboard</Title>
              <Subtitle>Visão geral dos dados agrícolas</Subtitle>
            </HeaderContent>

            <FilterContainer>
              <FilterLabel>
                <Users size={16} />
                Filtrar por Produtor
              </FilterLabel>
              <Select
                value={selectedProducerId}
                onChange={(e) => setSelectedProducerId(e.target.value)}
              >
                <option value="">Todos os produtores</option>
                {producers?.map((producer) => (
                  <option key={producer.id} value={producer.id}>
                    {producer.name}
                  </option>
                ))}
              </Select>
              <CurrentFilter>
                {isFiltered ? `Exibindo: ${selectedProducer?.name}` : 'Exibindo: Dados gerais'}
              </CurrentFilter>
            </FilterContainer>
          </HeaderTop>
        </Header>
        
        <EmptyState>
          <EmptyIcon>🌱</EmptyIcon>
          <EmptyTitle>Nenhum dado disponível</EmptyTitle>
          <EmptyDescription>
            {isFiltered 
              ? `Este produtor não possui fazendas cadastradas ainda`
              : `Adicione produtores e fazendas para visualizar as estatísticas no dashboard`
            }
          </EmptyDescription>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderTop>
          <HeaderContent>
            <Title>Dashboard</Title>
            <Subtitle>
              {isFiltered 
                ? `Dados de ${selectedProducer?.name}` 
                : 'Visão geral dos dados agrícolas'
              }
            </Subtitle>
          </HeaderContent>

          <FilterContainer>
            <FilterLabel>
              <Users size={16} />
              Filtrar por Produtor
            </FilterLabel>
            <Select
              value={selectedProducerId}
              onChange={(e) => setSelectedProducerId(e.target.value)}
            >
              <option value="">Todos os produtores</option>
              {producers?.map((producer) => (
                <option key={producer.id} value={producer.id}>
                  {producer.name}
                </option>
              ))}
            </Select>
            <CurrentFilter>
              {isFiltered ? `Exibindo: ${selectedProducer?.name}` : 'Exibindo: Dados gerais'}
            </CurrentFilter>
          </FilterContainer>
        </HeaderTop>
      </Header>

      <StatsGrid>
        <StatsCard
          title="Total de Fazendas"
          value={stats.totalFarms}
          subtitle={`${stats.totalFarms === 1 ? 'fazenda cadastrada' : 'fazendas cadastradas'}`}
          icon={<Tractor size={24} />}
          color="primary"
        />

        <StatsCard
          title="Área Total"
          value={`${stats.totalHectares.toFixed(1)} ha`}
          subtitle="hectares em total"
          icon={<MapPin size={24} />}
          color="success"
        />

        <StatsCard
          title="Estados"
          value={stats.stateDistribution.length}
          subtitle={`${stats.stateDistribution.length === 1 ? 'estado representado' : 'estados representados'}`}
          icon={<MapPin size={24} />}
          color="secondary"
        />

        <StatsCard
          title="Culturas"
          value={stats.cropDistribution.length}
          subtitle={`${stats.cropDistribution.length === 1 ? 'tipo de cultura' : 'tipos de culturas'}`}
          icon={<Sprout size={24} />}
          color="warning"
        />
      </StatsGrid>

      <ChartsGrid>
        <PieChart
          title="Distribuição por Estado"
          data={stats.stateDistribution}
          formatValue={(value) => `${value} fazenda${value !== 1 ? 's' : ''}`}
        />

        <PieChart
          title="Distribuição por Cultura"
          data={stats.cropDistribution}
          formatValue={(value) => `${value} safra${value !== 1 ? 's' : ''}`}
        />

        <PieChart
          title="Uso do Solo"
          data={stats.landUseDistribution}
          formatValue={formatHectares}
          colors={['#10b981', '#059669', '#f59e0b']}
        />
      </ChartsGrid>
    </Container>
  );
}; 