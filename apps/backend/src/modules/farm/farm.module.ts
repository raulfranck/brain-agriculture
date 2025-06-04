import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Farm } from './entities/farm.entity';
import { FarmService } from './services/farm.service';
import { FarmController } from './controllers/farm.controller';
import { ProducerModule } from '../producer/producer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Farm]),
    ProducerModule, // Para acessar Producer repository
  ],
  providers: [FarmService],
  controllers: [FarmController],
  exports: [FarmService, TypeOrmModule],
})
export class FarmModule {} 