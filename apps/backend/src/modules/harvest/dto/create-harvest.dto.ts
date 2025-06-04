import { IsNumber, IsUUID, IsNotEmpty, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHarvestDto {
  @ApiProperty({ 
    example: 2023,
    description: 'Ano da safra'
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1900)
  @Max(2100)
  year: number;

  @ApiProperty({ 
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'ID da fazenda (UUID)'
  })
  @IsUUID()
  @IsNotEmpty()
  farmId: string;

  @ApiProperty({ 
    example: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
    description: 'ID da cultura (UUID)'
  })
  @IsUUID()
  @IsNotEmpty()
  cropId: string;
} 