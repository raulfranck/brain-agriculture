import React from 'react';
import styled from 'styled-components';
import { Card } from '../../components/molecules/Card/Card';
import { useGetHealthQuery, useGetDashboardStatsQuery } from '../../store/api';

const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
  color: #111827;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 16px;
  color: #6b7280;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const StatCard = styled(Card)`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
`;

const HealthStatus = styled.div<{ status: 'ok' | 'error' | 'loading' }>`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
  
  ${({ status }) => {
    switch (status) {
      case 'ok':
        return `
          background-color: #d1fae5;
          color: #065f46;
        `;
      case 'error':
        return `
          background-color: #fecaca;
          color: #991b1b;
        `;
      default:
        return `
          background-color: #f3f4f6;
          color: #6b7280;
        `;
    }
  }}
`;

export const Dashboard: React.FC = () => {
  const { data: health, isLoading: healthLoading } = useGetHealthQuery();
  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();

  const getHealthStatus = () => {
    if (healthLoading) return 'loading';
    return health?.status === 'ok' ? 'ok' : 'error';
  };

  const getHealthText = () => {
    if (healthLoading) return 'Verificando...';
    return health?.status === 'ok' ? 'Sistema Online' : 'Sistema Offline';
  };

  return (
    <Container>
      <Header>
        <Title>🌾 Brain Agriculture</Title>
        <Subtitle>Dashboard de Produtores Rurais</Subtitle>
        <div style={{ marginTop: '16px' }}>
          <HealthStatus status={getHealthStatus()}>
            {getHealthText()}
          </HealthStatus>
        </div>
      </Header>

      <StatsGrid>
        <StatCard title="Total de Fazendas">
          <StatValue>
            {statsLoading ? '...' : stats?.totalFarms || 0}
          </StatValue>
          <StatLabel>Fazendas Cadastradas</StatLabel>
        </StatCard>

        <StatCard title="Total de Hectares">
          <StatValue>
            {statsLoading ? '...' : stats?.totalHectares?.toLocaleString() || 0}
          </StatValue>
          <StatLabel>Hectares Totais</StatLabel>
        </StatCard>

        <StatCard title="Estados">
          <StatValue>
            {statsLoading ? '...' : stats?.farmsByState?.length || 0}
          </StatValue>
          <StatLabel>Estados Representados</StatLabel>
        </StatCard>

        <StatCard title="Culturas">
          <StatValue>
            {statsLoading ? '...' : stats?.farmsByCrop?.length || 0}
          </StatValue>
          <StatLabel>Tipos de Culturas</StatLabel>
        </StatCard>
      </StatsGrid>

      {/* Charts section - to be implemented */}
      <Card title="Gráficos Analíticos">
        <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px' }}>
          Gráficos de pizza serão implementados aqui (Estado, Cultura, Uso do Solo)
        </p>
      </Card>
    </Container>
  );
}; 