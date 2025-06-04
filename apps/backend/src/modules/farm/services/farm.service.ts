import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farm } from '../entities/farm.entity';
import { Producer } from '../../producer/entities/producer.entity';
import { CreateFarmDto } from '../dtos/create-farm.dto';
import { UpdateFarmDto } from '../dtos/update-farm.dto';

@Injectable()
export class FarmService {
  constructor(
    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,
    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
  ) {}

  async create(createFarmDto: CreateFarmDto): Promise<Farm> {
    // Verifica se o produtor existe
    const producer = await this.producerRepository.findOne({
      where: { id: createFarmDto.producerId }
    });

    if (!producer) {
      throw new NotFoundException('Produtor não encontrado');
    }

    // Valida áreas antes de criar
    this.validateAreas(createFarmDto.totalArea, createFarmDto.arableArea, createFarmDto.vegetationArea);

    const farm = this.farmRepository.create({
      ...createFarmDto,
      producer
    });

    return await this.farmRepository.save(farm);
  }

  async findAll(): Promise<Farm[]> {
    return await this.farmRepository.find({
      relations: ['producer']
    });
  }

  async findOne(id: string): Promise<Farm> {
    const farm = await this.farmRepository.findOne({
      where: { id },
      relations: ['producer']
    });

    if (!farm) {
      throw new NotFoundException('Fazenda não encontrada');
    }

    return farm;
  }

  async update(id: string, updateFarmDto: UpdateFarmDto): Promise<Farm> {
    const farm = await this.findOne(id);

    // Se está alterando o produtor, verifica se existe
    if (updateFarmDto.producerId && updateFarmDto.producerId !== farm.producer.id) {
      const producer = await this.producerRepository.findOne({
        where: { id: updateFarmDto.producerId }
      });

      if (!producer) {
        throw new NotFoundException('Produtor não encontrado');
      }

      farm.producer = producer;
    }

    // Atualiza os campos
    Object.assign(farm, updateFarmDto);

    // Valida áreas após atualização
    this.validateAreas(farm.totalArea, farm.arableArea, farm.vegetationArea);

    return await this.farmRepository.save(farm);
  }

  async remove(id: string): Promise<void> {
    const farm = await this.findOne(id);
    await this.farmRepository.remove(farm);
  }

  async findByProducer(producerId: string): Promise<Farm[]> {
    return await this.farmRepository.find({
      where: { producer: { id: producerId } },
      relations: ['producer']
    });
  }

  private validateAreas(totalArea: number, arableArea: number, vegetationArea: number): void {
    const usedArea = arableArea + vegetationArea;
    if (usedArea > totalArea) {
      throw new BadRequestException(
        `Área agricultável (${arableArea}) + vegetação (${vegetationArea}) = ${usedArea} não pode exceder a área total (${totalArea})`
      );
    }
  }
} 