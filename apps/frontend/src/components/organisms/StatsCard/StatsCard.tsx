import React from 'react';
import styled from 'styled-components';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning';
}

const CardContainer = styled.div<{ color: string }>`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => {
    switch (props.color) {
      case 'primary': return '#3b82f6';
      case 'secondary': return '#6b7280';
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      default: return '#3b82f6';
    }
  }};
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const IconContainer = styled.div<{ color: string }>`
  padding: 12px;
  border-radius: 8px;
  background: ${props => {
    switch (props.color) {
      case 'primary': return '#dbeafe';
      case 'secondary': return '#f3f4f6';
      case 'success': return '#d1fae5';
      case 'warning': return '#fef3c7';
      default: return '#dbeafe';
    }
  }};
  color: ${props => {
    switch (props.color) {
      case 'primary': return '#3b82f6';
      case 'secondary': return '#6b7280';
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      default: return '#3b82f6';
    }
  }};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Value = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 8px 0;
  line-height: 1;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: #6b7280;
`;

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'primary',
}) => {
  return (
    <CardContainer color={color}>
      <Header>
        <Content>
          <Title>{title}</Title>
        </Content>
        {icon && <IconContainer color={color}>{icon}</IconContainer>}
      </Header>
      <Value>{value}</Value>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </CardContainer>
  );
}; 