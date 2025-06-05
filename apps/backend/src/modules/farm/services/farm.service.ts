import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from 'nestjs-pino';
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
    @Inject(Logger)
    private readonly logger: Logger,
  ) {}

  async create(createFarmDto: CreateFarmDto): Promise<Farm> {
    const startTime = Date.now();
    
    this.logger.log({
      operation: 'farm.create',
      producerId: createFarmDto.producerId,
      farmName: createFarmDto.name,
      city: createFarmDto.city,
      state: createFarmDto.state,
      totalArea: createFarmDto.totalArea,
      arableArea: createFarmDto.arableArea,
      vegetationArea: createFarmDto.vegetationArea,
    }, 'Iniciando criação de fazenda');

    // Verificar se o produtor existe
    const producer = await this.producerRepository.findOne({
      where: { id: createFarmDto.producerId },
    });

    if (!producer) {
      this.logger.warn({
        operation: 'farm.create',
        producerId: createFarmDto.producerId,
        duration: Date.now() - startTime,
      }, 'Tentativa de criar fazenda para produtor inexistente');
      
      throw new NotFoundException('Produtor não encontrado');
    }

    // Validar áreas (dupla verificação além da validação na entidade)
    const usedArea = createFarmDto.arableArea + createFarmDto.vegetationArea;
    if (usedArea > createFarmDto.totalArea) {
      this.logger.warn({
        operation: 'farm.create',
        producerId: createFarmDto.producerId,
        totalArea: createFarmDto.totalArea,
        arableArea: createFarmDto.arableArea,
        vegetationArea: createFarmDto.vegetationArea,
        usedArea,
        duration: Date.now() - startTime,
      }, 'Tentativa de criar fazenda com áreas inválidas');
      
      throw new BadRequestException(
        `Área agricultável (${createFarmDto.arableArea}) + vegetação (${createFarmDto.vegetationArea}) = ${usedArea} não pode exceder a área total (${createFarmDto.totalArea})`
      );
    }

    const farm = this.farmRepository.create({
      name: createFarmDto.name,
      city: createFarmDto.city,
      state: createFarmDto.state,
      totalArea: createFarmDto.totalArea,
      arableArea: createFarmDto.arableArea,
      vegetationArea: createFarmDto.vegetationArea,
      producerId: createFarmDto.producerId,
      producer,
    });

    const savedFarm = await this.farmRepository.save(farm);

    this.logger.log({
      operation: 'farm.create',
      farmId: savedFarm.id,
      producerId: createFarmDto.producerId,
      farmName: savedFarm.name,
      city: savedFarm.city,
      state: savedFarm.state,
      totalArea: savedFarm.totalArea,
      duration: Date.now() - startTime,
    }, 'Fazenda criada com sucesso');

    return savedFarm;
  }

  async findAll(): Promise<Farm[]> {
    const startTime = Date.now();
    
    this.logger.debug({
      operation: 'farm.findAll',
    }, 'Buscando todas as fazendas');

    const farms = await this.farmRepository.find({
      relations: ['producer'],
    });

    this.logger.log({
      operation: 'farm.findAll',
      count: farms.length,
      duration: Date.now() - startTime,
    }, 'Fazendas encontradas');

    return farms;
  }

  async findOne(id: string): Promise<Farm> {
    const startTime = Date.now();
    
    this.logger.debug({
      operation: 'farm.findOne',
      farmId: id,
    }, 'Buscando fazenda por ID');

    const farm = await this.farmRepository.findOne({
      where: { id },
      relations: ['producer'],
    });

    if (!farm) {
      this.logger.warn({
        operation: 'farm.findOne',
        farmId: id,
        duration: Date.now() - startTime,
      }, 'Fazenda não encontrada');
      
      throw new NotFoundException('Fazenda não encontrada');
    }

    this.logger.debug({
      operation: 'farm.findOne',
      farmId: id,
      producerId: farm.producer?.id,
      duration: Date.now() - startTime,
    }, 'Fazenda encontrada');

    return farm;
  }

  async findByProducer(producerId: string): Promise<Farm[]> {
    const startTime = Date.now();
    
    this.logger.debug({
      operation: 'farm.findByProducer',
      producerId,
    }, 'Buscando fazendas por produtor');

    // Verificar se o produtor existe
    const producer = await this.producerRepository.findOne({
      where: { id: producerId },
    });

    if (!producer) {
      this.logger.warn({
        operation: 'farm.findByProducer',
        producerId,
        duration: Date.now() - startTime,
      }, 'Tentativa de buscar fazendas para produtor inexistente');
      
      throw new NotFoundException('Produtor não encontrado');
    }

    const farms = await this.farmRepository.find({
      where: { producerId },
      relations: ['producer'],
    });

    this.logger.log({
      operation: 'farm.findByProducer',
      producerId,
      count: farms.length,
      duration: Date.now() - startTime,
    }, 'Fazendas encontradas para o produtor');

    return farms;
  }

  async update(id: string, updateFarmDto: UpdateFarmDto): Promise<Farm> {
    const startTime = Date.now();
    
    this.logger.log({
      operation: 'farm.update',
      farmId: id,
      updateFields: Object.keys(updateFarmDto),
    }, 'Iniciando atualização de fazenda');

    const farm = await this.findOne(id);

    // Se está atualizando áreas, validar
    const newArableArea = updateFarmDto.arableArea ?? farm.arableArea;
    const newVegetationArea = updateFarmDto.vegetationArea ?? farm.vegetationArea;
    const newTotalArea = updateFarmDto.totalArea ?? farm.totalArea;
    
    const usedArea = newArableArea + newVegetationArea;
    if (usedArea > newTotalArea) {
      this.logger.warn({
        operation: 'farm.update',
        farmId: id,
        newTotalArea,
        newArableArea,
        newVegetationArea,
        usedArea,
        duration: Date.now() - startTime,
      }, 'Tentativa de atualizar fazenda com áreas inválidas');
      
      throw new BadRequestException(
        `Área agricultável (${newArableArea}) + vegetação (${newVegetationArea}) = ${usedArea} não pode exceder a área total (${newTotalArea})`
      );
    }

    try {
      // Método mais robusto usando merge + save para evitar problemas de índices corrompidos
      const farmToUpdate = await this.farmRepository.findOne({ where: { id } });
      if (!farmToUpdate) {
        throw new NotFoundException('Fazenda não encontrada');
      }

      const mergedFarm = this.farmRepository.merge(farmToUpdate, updateFarmDto);
      const savedFarm = await this.farmRepository.save(mergedFarm);

    this.logger.log({
      operation: 'farm.update',
      farmId: id,
      updateFields: Object.keys(updateFarmDto),
      duration: Date.now() - startTime,
    }, 'Fazenda atualizada com sucesso');

      return savedFarm;
    } catch (error) {
      // Se for erro de índice corrompido, tentar método alternativo
      if (error.message?.includes('unexpected zero page') || 
          error.message?.includes('pg_publication_rel')) {
        this.logger.warn({
          operation: 'farm.update',
          farmId: id,
          error: error.message,
          duration: Date.now() - startTime,
        }, 'Detectado problema de índice corrompido, tentando método alternativo');

        // Método alternativo: deletar e recriar
        await this.farmRepository.delete(id);
        const newFarm = this.farmRepository.create({
          ...farm,
          ...updateFarmDto,
        });
        const savedFarm = await this.farmRepository.save(newFarm);

        this.logger.log({
          operation: 'farm.update',
          farmId: id,
          method: 'alternative',
          duration: Date.now() - startTime,
        }, 'Fazenda atualizada usando método alternativo');

        return savedFarm;
      }
      
      this.logger.error({
        operation: 'farm.update',
        farmId: id,
        error: error.message,
        stack: error.stack,
        duration: Date.now() - startTime,
      }, 'Erro ao atualizar fazenda');
      
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const startTime = Date.now();
    
    this.logger.log({
      operation: 'farm.remove',
      farmId: id,
    }, 'Iniciando remoção de fazenda');

    const farm = await this.findOne(id);
    await this.farmRepository.remove(farm);

    this.logger.log({
      operation: 'farm.remove',
      farmId: id,
      duration: Date.now() - startTime,
    }, 'Fazenda removida com sucesso');
  }
} 