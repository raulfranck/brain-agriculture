import React from 'react';
import styled from 'styled-components';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const StyledCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const CardTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
`;

const CardContent = styled.div`
  color: #374151;
`;

export const Card: React.FC<CardProps> = ({ children, title, className }) => {
  return (
    <StyledCard className={className}>
      {title && <CardTitle>{title}</CardTitle>}
      <CardContent>{children}</CardContent>
    </StyledCard>
  );
}; 