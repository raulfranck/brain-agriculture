import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Producer } from '../../producer/entities/producer.entity';

@Entity()
export class Farm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('float')
  totalArea: number;

  @Column('float')
  arableArea: number;

  @Column('float')
  vegetationArea: number;

  @ManyToOne(() => Producer)
  producer: Producer;
} 