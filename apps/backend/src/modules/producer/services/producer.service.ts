import { Injectable, ConflictException, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from 'nestjs-pino';
import { Producer } from '../entities/producer.entity';
import { CreateProducerDto } from '../dtos/create-producer.dto';
import { UpdateProducerDto } from '../dtos/update-producer.dto';

@Injectable()
export class ProducerService {
  constructor(
    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
    @Inject(Logger)
    private readonly logger: Logger,
  ) {}

  async create(createProducerDto: CreateProducerDto): Promise<Producer> {
    const startTime = Date.now();
    
    this.logger.log({
      operation: 'producer.create',
      document: createProducerDto.document,
      city: createProducerDto.city,
      state: createProducerDto.state,
    }, 'Iniciando criação de produtor');

    // Verificar se já existe um produtor com o mesmo documento
    const existingProducer = await this.producerRepository.findOne({
      where: { document: createProducerDto.document },
    });

    if (existingProducer) {
      this.logger.warn({
        operation: 'producer.create',
        document: createProducerDto.document,
        existingProducerId: existingProducer.id,
        duration: Date.now() - startTime,
      }, 'Tentativa de criar produtor com documento duplicado');
      
      throw new ConflictException('Já existe um produtor com este documento');
    }

    const producer = this.producerRepository.create(createProducerDto);
    const savedProducer = await this.producerRepository.save(producer);

    this.logger.log({
      operation: 'producer.create',
      producerId: savedProducer.id,
      document: savedProducer.document,
      duration: Date.now() - startTime,
    }, 'Produtor criado com sucesso');

    return savedProducer;
  }

  async findAll(): Promise<Producer[]> {
    const startTime = Date.now();
    
    this.logger.debug({
      operation: 'producer.findAll',
    }, 'Buscando todos os produtores');

    const producers = await this.producerRepository.find({
      relations: ['farms'],
    });

    this.logger.log({
      operation: 'producer.findAll',
      count: producers.length,
      duration: Date.now() - startTime,
    }, 'Produtores encontrados');

    return producers;
  }

  async findOne(id: string): Promise<Producer> {
    const startTime = Date.now();
    
    this.logger.debug({
      operation: 'producer.findOne',
      producerId: id,
    }, 'Buscando produtor por ID');

    const producer = await this.producerRepository.findOne({
      where: { id },
      relations: ['farms'],
    });

    if (!producer) {
      this.logger.warn({
        operation: 'producer.findOne',
        producerId: id,
        duration: Date.now() - startTime,
      }, 'Produtor não encontrado');
      
      throw new NotFoundException('Produtor não encontrado');
    }

    this.logger.debug({
      operation: 'producer.findOne',
      producerId: id,
      farmsCount: producer.farms?.length || 0,
      duration: Date.now() - startTime,
    }, 'Produtor encontrado');

    return producer;
  }

  async update(id: string, updateProducerDto: UpdateProducerDto): Promise<Producer> {
    const startTime = Date.now();
    
    this.logger.log({
      operation: 'producer.update',
      producerId: id,
      updateFields: Object.keys(updateProducerDto),
    }, 'Iniciando atualização de produtor');

    // Verificar se o produtor existe
    const producer = await this.findOne(id);

    // Se está atualizando o documento, verificar se não há duplicata
    if (updateProducerDto.document && updateProducerDto.document !== producer.document) {
      const existingProducer = await this.producerRepository.findOne({
        where: { document: updateProducerDto.document },
      });

      if (existingProducer) {
        this.logger.warn({
          operation: 'producer.update',
          producerId: id,
          newDocument: updateProducerDto.document,
          existingProducerId: existingProducer.id,
          duration: Date.now() - startTime,
        }, 'Tentativa de atualizar para documento duplicado');
        
        throw new ConflictException('Já existe um produtor com este documento');
      }
    }

    try {
      // Método mais robusto usando merge + save para evitar problemas de índices corrompidos
      const producerToUpdate = await this.producerRepository.findOne({ where: { id } });
      if (!producerToUpdate) {
        throw new NotFoundException('Produtor não encontrado');
      }

      const mergedProducer = this.producerRepository.merge(producerToUpdate, updateProducerDto);
      const savedProducer = await this.producerRepository.save(mergedProducer);

    this.logger.log({
      operation: 'producer.update',
      producerId: id,
      updateFields: Object.keys(updateProducerDto),
      duration: Date.now() - startTime,
    }, 'Produtor atualizado com sucesso');

      return savedProducer;
    } catch (error) {
      // Se for erro de índice corrompido, tentar método alternativo
      if (error.message?.includes('unexpected zero page') || 
          error.message?.includes('pg_publication_rel')) {
        this.logger.warn({
          operation: 'producer.update',
          producerId: id,
          error: error.message,
          duration: Date.now() - startTime,
        }, 'Detectado problema de índice corrompido, tentando método alternativo');

        // Método alternativo: deletar e recriar (cuidado com cascata)
        const farmsBackup = producer.farms || [];
        
        await this.producerRepository.delete(id);
        const newProducer = this.producerRepository.create({
          ...producer,
          ...updateProducerDto,
          farms: farmsBackup, // Manter fazendas associadas
        });
        const savedProducer = await this.producerRepository.save(newProducer);

        this.logger.log({
          operation: 'producer.update',
          producerId: id,
          method: 'alternative',
          duration: Date.now() - startTime,
        }, 'Produtor atualizado usando método alternativo');

        return savedProducer;
      }
      
      this.logger.error({
        operation: 'producer.update',
        producerId: id,
        error: error.message,
        stack: error.stack,
        duration: Date.now() - startTime,
      }, 'Erro ao atualizar produtor');
      
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const startTime = Date.now();
    
    this.logger.log({
      operation: 'producer.remove',
      producerId: id,
    }, 'Iniciando remoção de produtor');

    const producer = await this.findOne(id);
    
    // Excluir fazendas associadas primeiro (cascata)
    if (producer.farms && producer.farms.length > 0) {
      this.logger.log({
        operation: 'producer.remove',
        producerId: id,
        farmsCount: producer.farms.length,
      }, 'Removendo fazendas associadas ao produtor');
      
      // Aqui o TypeORM vai lidar com a exclusão em cascata automaticamente
      // devido à configuração cascade: ['remove'] na entidade
    }

    await this.producerRepository.remove(producer);

    this.logger.log({
      operation: 'producer.remove',
      producerId: id,
      farmsRemoved: producer.farms?.length || 0,
      duration: Date.now() - startTime,
    }, 'Produtor e suas fazendas removidos com sucesso');
  }
} 