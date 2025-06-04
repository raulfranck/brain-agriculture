import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Farm } from '../../farm/entities/farm.entity';

@Entity()
export class Producer {
  @ApiProperty({ 
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Identificador único do produtor (UUID)'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ 
    example: 'João Silva',
    description: 'Nome completo do produtor rural'
  })
  @Column()
  name: string;

  @ApiProperty({ 
    example: '12345678901',
    description: 'CPF (11 dígitos) ou CNPJ (14 dígitos) do produtor'
  })
  @Column({ unique: true })
  document: string; // CPF ou CNPJ

  @ApiProperty({ 
    example: 'São Paulo',
    description: 'Cidade onde o produtor está localizado'
  })
  @Column()
  city: string;

  @ApiProperty({ 
    example: 'SP',
    description: 'Estado onde o produtor está localizado'
  })
  @Column()
  state: string;

  @ApiProperty({ 
    type: () => [Farm],
    description: 'Lista de fazendas pertencentes ao produtor',
    isArray: true
  })
  @OneToMany(() => Farm, (farm) => farm.producer, { cascade: ['remove'], onDelete: 'CASCADE' })
  farms: Farm[];
} 