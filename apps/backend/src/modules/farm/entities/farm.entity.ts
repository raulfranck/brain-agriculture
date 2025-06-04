import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Producer } from '../../producer/entities/producer.entity';
import { BadRequestException } from '@nestjs/common';

@Entity()
export class Farm {
  @ApiProperty({ 
    example: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
    description: 'Identificador único da fazenda (UUID)'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ 
    example: 'Fazenda São João',
    description: 'Nome da fazenda'
  })
  @Column()
  name: string;

  @ApiProperty({ 
    example: 1000.5,
    description: 'Área total da fazenda em hectares'
  })
  @Column('float')
  totalArea: number;

  @ApiProperty({ 
    example: 600.3,
    description: 'Área agricultável da fazenda em hectares'
  })
  @Column('float')
  arableArea: number;

  @ApiProperty({ 
    example: 300.2,
    description: 'Área de vegetação da fazenda em hectares'
  })
  @Column('float')
  vegetationArea: number;

  @ApiProperty({ 
    type: () => Producer,
    description: 'Produtor proprietário da fazenda'
  })
  @ManyToOne(() => Producer, (producer) => producer.farms)
  @JoinColumn()
  producer: Producer;

  @BeforeInsert()
  @BeforeUpdate()
  validateAreas() {
    const usedArea = this.arableArea + this.vegetationArea;
    if (usedArea > this.totalArea) {
      throw new BadRequestException(
        `Área agricultável (${this.arableArea}) + vegetação (${this.vegetationArea}) = ${usedArea} não pode exceder a área total (${this.totalArea})`
      );
    }
  }
} 