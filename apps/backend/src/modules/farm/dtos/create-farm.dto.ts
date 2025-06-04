import { IsString, IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFarmDto {
  @ApiProperty({ 
    example: 'Fazenda São João',
    description: 'Nome identificador da fazenda',
    minLength: 2,
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    example: 1000.5,
    description: 'Área total da fazenda em hectares',
    minimum: 0.1,
    type: 'number',
    format: 'float'
  })
  @IsNumber()
  @IsPositive()
  totalArea: number;

  @ApiProperty({ 
    example: 600.3,
    description: 'Área agricultável da fazenda em hectares. Deve ser menor ou igual à área total.',
    minimum: 0,
    type: 'number',
    format: 'float'
  })
  @IsNumber()
  @IsPositive()
  arableArea: number;

  @ApiProperty({ 
    example: 300.2,
    description: 'Área de vegetação da fazenda em hectares. Junto com a área agricultável, não pode exceder a área total.',
    minimum: 0,
    type: 'number',
    format: 'float'
  })
  @IsNumber()
  @IsPositive()
  vegetationArea: number;

  @ApiProperty({ 
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'ID do produtor proprietário da fazenda (UUID)',
    format: 'uuid'
  })
  @IsUUID()
  @IsNotEmpty()
  producerId: string;
} 