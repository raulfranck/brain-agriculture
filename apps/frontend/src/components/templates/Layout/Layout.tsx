import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Users, Home } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Container = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
`;

const Sidebar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 250px;
  background: white;
  border-right: 1px solid #e5e7eb;
  padding: 24px 0;
  z-index: 100;
`;

const SidebarHeader = styled.div`
  padding: 0 24px 24px;
  border-bottom: 1px solid #e5e7eb;
`;

const Logo = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 24px 0 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin: 0;
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  text-decoration: none;
  color: ${props => props.$active ? '#10b981' : '#6b7280'};
  font-weight: ${props => props.$active ? '600' : '500'};
  transition: all 0.2s ease-in-out;
  background-color: ${props => props.$active ? '#f0fdfa' : 'transparent'};
  border-right: ${props => props.$active ? '3px solid #10b981' : '3px solid transparent'};

  &:hover {
    background-color: #f9fafb;
    color: #10b981;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const MainContent = styled.main`
  margin-left: 250px;
  min-height: 100vh;
`;

const navItems = [
  {
    to: '/',
    label: 'Dashboard',
    icon: Home,
  },
  {
    to: '/producers',
    label: 'Produtores',
    icon: Users,
  },
  {
    to: '/analytics',
    label: 'Análises',
    icon: BarChart3,
  },
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <Container>
      <Sidebar>
        <SidebarHeader>
          <Logo>
            🌾 Brain Agriculture
          </Logo>
        </SidebarHeader>
        
        <NavList>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            
            return (
              <NavItem key={item.to}>
                <NavLink to={item.to} $active={isActive}>
                  <Icon />
                  {item.label}
                </NavLink>
              </NavItem>
            );
          })}
        </NavList>
      </Sidebar>

      <MainContent>
        {children}
      </MainContent>
    </Container>
  );
}; 