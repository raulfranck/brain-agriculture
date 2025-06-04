import React from 'react';
import styled from 'styled-components';
import { IMaskInput } from 'react-imask';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'email';
  error?: string;
  required?: boolean;
  disabled?: boolean;
  mask?: string;
  min?: number;
}

const Container = styled.div`
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

  /* Remove arrows from number input */
  &[type="number"]::-webkit-outer-spin-button,
  &[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }
`;

const StyledIMaskInput = styled(IMaskInput)<{ hasError?: boolean }>`
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
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
`;

const RequiredMark = styled.span`
  color: #ef4444;
  margin-left: 4px;
`;

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  required,
  disabled,
  mask,
  min,
  ...rest
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // Validação para números não negativos
    if (type === 'number' && min !== undefined) {
      const numValue = parseFloat(newValue);
      if (!isNaN(numValue) && numValue < min) {
        newValue = min.toString();
      }
    }
    
    onChange(newValue);
  };

  const handleMaskChange = (value: string) => {
    onChange(value);
  };

  const renderInput = () => {
    if (mask) {
      return (
        <StyledIMaskInput
          mask={mask}
          value={value}
          onAccept={handleMaskChange}
          placeholder={placeholder}
          hasError={!!error}
          disabled={disabled}
          {...rest}
        />
      );
    }

    return (
      <StyledInput
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        hasError={!!error}
        required={required}
        disabled={disabled}
        min={min}
        {...rest}
      />
    );
  };

  return (
    <Container>
      {label && (
        <Label>
          {label}
          {required && <RequiredMark>*</RequiredMark>}
        </Label>
      )}
      {renderInput()}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
}; 