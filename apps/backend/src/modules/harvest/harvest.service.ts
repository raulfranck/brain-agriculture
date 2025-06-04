import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Harvest } from './entities/harvest.entity';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';
import { Farm } from '../farm/entities/farm.entity';
import { Crop } from '../crop/entities/crop.entity';

@Injectable()
export class HarvestService {
  constructor(
    @InjectRepository(Harvest)
    private readonly harvestRepository: Repository<Harvest>,
    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,
    @InjectRepository(Crop)
    private readonly cropRepository: Repository<Crop>,
  ) {}

  async create(createHarvestDto: CreateHarvestDto): Promise<Harvest> {
    // Verificar se a fazenda existe
    const farm = await this.farmRepository.findOne({
      where: { id: createHarvestDto.farmId },
    });
    if (!farm) {
      throw new NotFoundException(`Fazenda com ID ${createHarvestDto.farmId} não encontrada`);
    }

    // Verificar se a cultura existe
    const crop = await this.cropRepository.findOne({
      where: { id: createHarvestDto.cropId },
    });
    if (!crop) {
      throw new NotFoundException(`Cultura com ID ${createHarvestDto.cropId} não encontrada`);
    }

    // Verificar se já existe uma safra para esta fazenda, ano e cultura
    const existingHarvest = await this.harvestRepository.findOne({
      where: {
        farmId: createHarvestDto.farmId,
        cropId: createHarvestDto.cropId,
        year: createHarvestDto.year,
      },
    });

    if (existingHarvest) {
      throw new BadRequestException(
        `Já existe uma safra de ${crop.name} para o ano ${createHarvestDto.year} nesta fazenda`
      );
    }

    const harvest = this.harvestRepository.create(createHarvestDto);
    return await this.harvestRepository.save(harvest);
  }

  async findAll(): Promise<Harvest[]> {
    return await this.harvestRepository.find({
      relations: ['farm', 'crop'],
      order: { year: 'DESC' },
    });
  }

  async findByFarm(farmId: string): Promise<Harvest[]> {
    return await this.harvestRepository.find({
      where: { farmId },
      relations: ['crop'],
      order: { year: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Harvest> {
    const harvest = await this.harvestRepository.findOne({
      where: { id },
      relations: ['farm', 'crop'],
    });

    if (!harvest) {
      throw new NotFoundException(`Safra com ID ${id} não encontrada`);
    }

    return harvest;
  }

  async update(id: string, updateHarvestDto: UpdateHarvestDto): Promise<Harvest> {
    const harvest = await this.findOne(id);

    // Se farmId ou cropId estão sendo atualizados, validar novamente
    if (updateHarvestDto.farmId && updateHarvestDto.farmId !== harvest.farmId) {
      const farm = await this.farmRepository.findOne({
        where: { id: updateHarvestDto.farmId },
      });
      if (!farm) {
        throw new NotFoundException(`Fazenda com ID ${updateHarvestDto.farmId} não encontrada`);
      }
    }

    if (updateHarvestDto.cropId && updateHarvestDto.cropId !== harvest.cropId) {
      const crop = await this.cropRepository.findOne({
        where: { id: updateHarvestDto.cropId },
      });
      if (!crop) {
        throw new NotFoundException(`Cultura com ID ${updateHarvestDto.cropId} não encontrada`);
      }
    }

    Object.assign(harvest, updateHarvestDto);
    return await this.harvestRepository.save(harvest);
  }

  async remove(id: string): Promise<void> {
    const harvest = await this.findOne(id);
    await this.harvestRepository.remove(harvest);
  }
} 