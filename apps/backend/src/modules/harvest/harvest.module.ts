import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HarvestService } from './harvest.service';
import { HarvestController } from './harvest.controller';
import { Harvest } from './entities/harvest.entity';
import { Farm } from '../farm/entities/farm.entity';
import { Crop } from '../crop/entities/crop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Harvest, Farm, Crop])],
  controllers: [HarvestController],
  providers: [HarvestService],
  exports: [HarvestService],
})
export class HarvestModule {} 