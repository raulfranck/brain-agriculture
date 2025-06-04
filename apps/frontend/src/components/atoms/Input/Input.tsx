import React from 'react';
import styled from 'styled-components';

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'number';
  name?: string;
}

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const StyledInput = styled.input<{ hasError?: boolean }>`
  padding: 12px 16px;
  border: 1px solid ${props => props.hasError ? '#ef4444' : '#d1d5db'};
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#ef4444' : '#10b981'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? '#fecaca' : '#d1fae5'};
  }

  &:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
    opacity: 0.6;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const ErrorText = styled.span`
  font-size: 12px;
  color: #ef4444;
`;

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  type = 'text',
  name,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <InputContainer>
      {label && (
        <Label>
          {label}
          {required && <span style={{ color: '#ef4444' }}> *</span>}
        </Label>
      )}
      <StyledInput
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        disabled={disabled}
        hasError={!!error}
        name={name}
        {...props}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </InputContainer>
  );
}; 