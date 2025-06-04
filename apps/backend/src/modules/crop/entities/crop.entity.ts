import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Harvest } from '../../harvest/entities/harvest.entity';

@Entity()
export class Crop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Harvest, (harvest) => harvest.crop)
  harvests: Harvest[];
} 