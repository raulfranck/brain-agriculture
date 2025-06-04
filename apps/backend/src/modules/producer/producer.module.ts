import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producer } from './entities/producer.entity';
import { ProducerService } from './services/producer.service';
import { ProducerController } from './controllers/producer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Producer])],
  providers: [ProducerService],
  controllers: [ProducerController],
  exports: [ProducerService, TypeOrmModule],
})
export class ProducerModule {} 