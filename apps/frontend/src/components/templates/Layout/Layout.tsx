import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { BarChart3, Users, Truck, Leaf } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f9fafb;
`;

const Sidebar = styled.aside`
  width: 240px;
  background: white;
  border-right: 1px solid #e5e7eb;
  padding: 24px 0;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 24px;
  margin-bottom: 32px;
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: #10b981;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoText = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
`;

const Navigation = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 16px;
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  
  background: ${props => props.$isActive ? '#ecfdf5' : 'transparent'};
  color: ${props => props.$isActive ? '#10b981' : '#6b7280'};

  &:hover {
    background: ${props => props.$isActive ? '#ecfdf5' : '#f3f4f6'};
    color: ${props => props.$isActive ? '#10b981' : '#374151'};
  }
`;

const MainContent = styled.main`
  flex: 1;
  overflow: auto;
`;

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Container>
      <Sidebar>
        <Logo>
          <LogoIcon>
            <Leaf size={20} color="white" />
          </LogoIcon>
          <LogoText>Brain Agriculture</LogoText>
        </Logo>

        <Navigation>
          <NavLink to="/" $isActive={isActive('/')}>
            <BarChart3 size={20} />
            Dashboard
          </NavLink>
          
          <NavLink to="/producers" $isActive={isActive('/producers')}>
            <Users size={20} />
            Produtores
          </NavLink>

          <NavLink to="/farms" $isActive={isActive('/farms')}>
            <Truck size={20} />
            Fazendas
          </NavLink>
          
          <NavLink to="/analytics" $isActive={isActive('/analytics')}>
            <BarChart3 size={20} />
            Análises
          </NavLink>
        </Navigation>
      </Sidebar>

      <MainContent>{children}</MainContent>
    </Container>
  );
}; 