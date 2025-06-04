import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producer } from '../entities/producer.entity';
import { CreateProducerDto } from '../dtos/create-producer.dto';
import { UpdateProducerDto } from '../dtos/update-producer.dto';

@Injectable()
export class ProducerService {
  constructor(
    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
  ) {}

  async create(createProducerDto: CreateProducerDto): Promise<Producer> {
    // Verifica se já existe produtor com mesmo documento
    const existingProducer = await this.producerRepository.findOne({
      where: { document: createProducerDto.document }
    });

    if (existingProducer) {
      throw new ConflictException('Já existe um produtor com este documento');
    }

    const producer = this.producerRepository.create(createProducerDto);
    return await this.producerRepository.save(producer);
  }

  async findAll(): Promise<Producer[]> {
    return await this.producerRepository.find({
      relations: ['farms']
    });
  }

  async findOne(id: string): Promise<Producer> {
    const producer = await this.producerRepository.findOne({
      where: { id },
      relations: ['farms']
    });

    if (!producer) {
      throw new NotFoundException('Produtor não encontrado');
    }

    return producer;
  }

  async update(id: string, updateProducerDto: UpdateProducerDto): Promise<Producer> {
    const producer = await this.findOne(id);

    // Se está alterando documento, verifica se não existe outro com mesmo documento
    if (updateProducerDto.document && updateProducerDto.document !== producer.document) {
      const existingProducer = await this.producerRepository.findOne({
        where: { document: updateProducerDto.document }
      });

      if (existingProducer) {
        throw new ConflictException('Já existe um produtor com este documento');
      }
    }

    Object.assign(producer, updateProducerDto);
    return await this.producerRepository.save(producer);
  }

  async remove(id: string): Promise<void> {
    const producer = await this.findOne(id);
    await this.producerRepository.remove(producer);
  }
} 