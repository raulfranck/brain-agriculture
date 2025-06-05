import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ProducerService } from './producer.service';
import { Producer } from '../entities/producer.entity';
import { CreateProducerDto } from '../dtos/create-producer.dto';
import { UpdateProducerDto } from '../dtos/update-producer.dto';

describe('ProducerService', () => {
  let service: ProducerService;
  let repository: Repository<Producer>;
  let logger: Logger;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
    merge: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  const mockProducer: Producer = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'João Silva',
    document: '12345678901',
    city: 'São Paulo',
    state: 'SP',
    farms: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducerService,
        {
          provide: getRepositoryToken(Producer),
          useValue: mockRepository,
        },
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<ProducerService>(ProducerService);
    repository = module.get<Repository<Producer>>(getRepositoryToken(Producer));
    logger = module.get<Logger>(Logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createProducerDto: CreateProducerDto = {
      name: 'João Silva',
      document: '12345678901',
      city: 'São Paulo',
      state: 'SP',
    };

    it('should create a producer successfully', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockProducer);
      mockRepository.save.mockResolvedValue(mockProducer);

      const result = await service.create(createProducerDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { document: createProducerDto.document },
      });
      expect(mockRepository.create).toHaveBeenCalledWith(createProducerDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockProducer);
      expect(result).toEqual(mockProducer);
      expect(mockLogger.log).toHaveBeenCalledTimes(2);
    });

    it('should throw ConflictException when document already exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockProducer);

      await expect(service.create(createProducerDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { document: createProducerDto.document },
      });
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockLogger.warn).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all producers', async () => {
      const producers = [mockProducer];
      mockRepository.find.mockResolvedValue(producers);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['farms'],
      });
      expect(result).toEqual(producers);
      expect(mockLogger.log).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a producer by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockProducer);

      const result = await service.findOne(mockProducer.id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockProducer.id },
        relations: ['farms'],
      });
      expect(result).toEqual(mockProducer);
    });

    it('should throw NotFoundException when producer not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLogger.warn).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const updateProducerDto: UpdateProducerDto = {
      name: 'João Silva Updated',
      city: 'Rio de Janeiro',
      state: 'RJ',
    };

    it('should update a producer successfully using merge + save', async () => {
      const updatedProducer = { ...mockProducer, ...updateProducerDto };
      
      // Mock para findOne (usado em update)
      mockRepository.findOne.mockResolvedValueOnce(mockProducer); // Para verificar se existe
      mockRepository.findOne.mockResolvedValueOnce(mockProducer); // Para o merge
      mockRepository.merge.mockReturnValue(updatedProducer);
      mockRepository.save.mockResolvedValue(updatedProducer);

      const result = await service.update(mockProducer.id, updateProducerDto);

      expect(mockRepository.merge).toHaveBeenCalledWith(mockProducer, updateProducerDto);
      expect(mockRepository.save).toHaveBeenCalledWith(updatedProducer);
      expect(result).toEqual(updatedProducer);
      expect(mockLogger.log).toHaveBeenCalledTimes(2);
    });

    it('should throw ConflictException when updating to existing document', async () => {
      const conflictDto = { ...updateProducerDto, document: '98765432100' };
      const existingProducer = { ...mockProducer, id: 'different-id' };

      mockRepository.findOne.mockResolvedValueOnce(mockProducer); // Producer exists
      mockRepository.findOne.mockResolvedValueOnce(existingProducer); // Document conflict

      await expect(service.update(mockProducer.id, conflictDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockLogger.warn).toHaveBeenCalled();
    });

    it('should handle corrupted index error with fallback method', async () => {
      const corruptedError = new Error('index "pg_publication_rel_prrelid_prpubid_index" contains unexpected zero page');
      const updatedProducer = { ...mockProducer, ...updateProducerDto };

      mockRepository.findOne.mockResolvedValueOnce(mockProducer); // Producer exists
      mockRepository.findOne.mockResolvedValueOnce(mockProducer); // For merge
      mockRepository.merge.mockReturnValue(updatedProducer);
      mockRepository.save.mockRejectedValueOnce(corruptedError);
      
      // Fallback method
      mockRepository.delete.mockResolvedValue({ affected: 1 });
      mockRepository.create.mockReturnValue(updatedProducer);
      mockRepository.save.mockResolvedValueOnce(updatedProducer);

      const result = await service.update(mockProducer.id, updateProducerDto);

      expect(mockRepository.delete).toHaveBeenCalledWith(mockProducer.id);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...mockProducer,
        ...updateProducerDto,
        farms: [],
      });
      expect(result).toEqual(updatedProducer);
      expect(mockLogger.warn).toHaveBeenCalled();
      expect(mockLogger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'alternative',
        }),
        expect.any(String),
      );
    });
  });

  describe('remove', () => {
    it('should remove a producer successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockProducer);
      mockRepository.remove.mockResolvedValue(mockProducer);

      await service.remove(mockProducer.id);

      expect(mockRepository.remove).toHaveBeenCalledWith(mockProducer);
      expect(mockLogger.log).toHaveBeenCalledTimes(2);
    });

    it('should throw NotFoundException when trying to remove non-existent producer', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
}); 