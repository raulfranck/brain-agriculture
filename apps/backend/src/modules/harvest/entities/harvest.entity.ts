import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Farm } from '../../farm/entities/farm.entity';
import { Crop } from '../../crop/entities/crop.entity';

@Entity()
export class Harvest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  year: number;

  @Column()
  farmId: string;

  @ManyToOne(() => Farm, (farm) => farm.harvests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'farmId' })
  farm: Farm;

  @Column()
  cropId: string;

  @ManyToOne(() => Crop, (crop) => crop.harvests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cropId' })
  crop: Crop;
} 