import { IsString, IsNotEmpty, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentValidator } from '../../../shared/validators/document.validator';

export class CreateProducerDto {
  @ApiProperty({ 
    example: 'João Silva Santos',
    description: 'Nome completo do produtor rural',
    minLength: 2,
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    example: '12345678901', 
    description: 'CPF (11 dígitos) ou CNPJ (14 dígitos). Apenas números.',
    pattern: '^(\\d{11}|\\d{14})$',
    examples: {
      cpf: {
        value: '12345678901',
        description: 'Exemplo de CPF válido'
      },
      cnpj: {
        value: '12345678000195',
        description: 'Exemplo de CNPJ válido'
      }
    }
  })
  @IsString()
  @IsNotEmpty()
  @Validate(DocumentValidator)
  document: string;

  @ApiProperty({ 
    example: 'Ribeirão Preto',
    description: 'Cidade onde o produtor está localizado',
    minLength: 2,
    maxLength: 50
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ 
    example: 'SP',
    description: 'Estado onde o produtor está localizado (sigla UF)',
    minLength: 2,
    maxLength: 2,
    pattern: '^[A-Z]{2}$'
  })
  @IsString()
  @IsNotEmpty()
  state: string;
} 