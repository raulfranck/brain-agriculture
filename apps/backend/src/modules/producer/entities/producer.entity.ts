import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Farm } from '../../farm/entities/farm.entity';

@Entity()
export class Producer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  document: string; // CPF ou CNPJ

  @OneToMany(() => Farm, (farm) => farm.producer)
  farms: Farm[];
} 