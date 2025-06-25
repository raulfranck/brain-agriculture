import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farm } from '../farm/entities/farm.entity';
import { Producer } from '../producer/entities/producer.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Farm)
    private farmRepository: Repository<Farm>,
    @InjectRepository(Producer)
    private producerRepository: Repository<Producer>,
  ) {}

  async getStats() {
    // Total de fazendas
    const totalFarms = await this.farmRepository.count();

    // Total de hectares
    const farmsWithAreas = await this.farmRepository
      .createQueryBuilder('farm')
      .select('SUM(farm.totalArea)', 'total')
      .getRawOne();
    
    const totalHectares = parseFloat(farmsWithAreas?.total || '0');

    // Fazendas por estado
    const farmsByState = await this.farmRepository
      .createQueryBuilder('farm')
      .select('farm.state', 'state')
      .addSelect('COUNT(farm.id)', 'count')
      .groupBy('farm.state')
      .orderBy('count', 'DESC')
      .getRawMany();

    // Uso da terra (área agricultável vs vegetação)
    const landUseData = await this.farmRepository
      .createQueryBuilder('farm')
      .select('SUM(farm.arableArea)', 'arable')
      .addSelect('SUM(farm.vegetationArea)', 'vegetation')
      .getRawOne();

    const landUse = {
      arable: parseFloat(landUseData?.arable || '0'),
      vegetation: parseFloat(landUseData?.vegetation || '0'),
    };

    // Por enquanto, retornamos dados vazios para culturas
    const farmsByCrop = [
      { crop: 'Soja', count: 0 },
      { crop: 'Milho', count: 0 },
      { crop: 'Algodão', count: 0 },
      { crop: 'Café', count: 0 },
      { crop: 'Cana de Açúcar', count: 0 },
    ];

    return {
      totalFarms,
      totalHectares,
      farmsByState: farmsByState.map(item => ({
        state: item.state,
        count: parseInt(item.count, 10),
      })),
      farmsByCrop,
      landUse,
    };
  }
} 