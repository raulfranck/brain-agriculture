import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Farm } from '../farm/entities/farm.entity';
import { Producer } from '../producer/entities/producer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Farm, Producer])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {} 