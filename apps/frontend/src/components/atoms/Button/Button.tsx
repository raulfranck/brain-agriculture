import React from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const StyledButton = styled.button<Pick<ButtonProps, 'variant' | 'size' | 'disabled' | 'loading'>>`
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;

  ${({ size }) => {
    switch (size) {
      case 'small':
        return css`
          padding: 8px 16px;
          font-size: 14px;
          height: 32px;
        `;
      case 'large':
        return css`
          padding: 16px 32px;
          font-size: 16px;
          height: 48px;
        `;
      default:
        return css`
          padding: 12px 24px;
          font-size: 14px;
          height: 40px;
        `;
    }
  }}

  ${({ variant }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background-color: #f3f4f6;
          color: #374151;
          &:hover:not(:disabled) {
            background-color: #e5e7eb;
          }
        `;
      case 'danger':
        return css`
          background-color: #ef4444;
          color: white;
          &:hover:not(:disabled) {
            background-color: #dc2626;
          }
        `;
      default:
        return css`
          background-color: #10b981;
          color: white;
          &:hover:not(:disabled) {
            background-color: #059669;
          }
        `;
    }
  }}

  ${({ disabled, loading }) =>
    (disabled || loading) &&
    css`
      opacity: 0.6;
      cursor: not-allowed;
    `}
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      {...props}
    >
      {loading ? 'Carregando...' : children}
    </StyledButton>
  );
}; 