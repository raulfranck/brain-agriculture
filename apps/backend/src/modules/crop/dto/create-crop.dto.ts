import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCropDto {
  @ApiProperty({ 
    example: 'Soja',
    description: 'Nome da cultura'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    example: 'Soja (Glycine max)',
    description: 'Descrição da cultura',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;
} 