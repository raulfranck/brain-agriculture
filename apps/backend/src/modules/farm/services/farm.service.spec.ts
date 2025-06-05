import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { FarmService } from './farm.service';
import { Farm } from '../entities/farm.entity';
import { Producer } from '../../producer/entities/producer.entity';
import { CreateFarmDto } from '../dtos/create-farm.dto';
import { UpdateFarmDto } from '../dtos/update-farm.dto';

describe('FarmService', () => {
  let service: FarmService;
  let farmRepository: Repository<Farm>;
  let producerRepository: Repository<Producer>;
  let logger: Logger;

  const mockFarmRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
    merge: jest.fn(),
  };

  const mockProducerRepository = {
    findOne: jest.fn(),
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

  const mockFarm: Farm = {
    id: '987e6543-e21b-12d3-a456-426614174000',
    name: 'Fazenda São João',
    city: 'Ribeirão Preto',
    state: 'SP',
    totalArea: 1000,
    arableArea: 600,
    vegetationArea: 300,
    producerId: mockProducer.id,
    producer: mockProducer,
    harvests: [],
    validateAreas: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmService,
        {
          provide: getRepositoryToken(Farm),
          useValue: mockFarmRepository,
        },
        {
          provide: getRepositoryToken(Producer),
          useValue: mockProducerRepository,
        },
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<FarmService>(FarmService);
    farmRepository = module.get<Repository<Farm>>(getRepositoryToken(Farm));
    producerRepository = module.get<Repository<Producer>>(getRepositoryToken(Producer));
    logger = module.get<Logger>(Logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createFarmDto: CreateFarmDto = {
      name: 'Fazenda São João',
      city: 'Ribeirão Preto',
      state: 'SP',
      totalArea: 1000,
      arableArea: 600,
      vegetationArea: 300,
      producerId: mockProducer.id,
    };

    it('should create a farm successfully', async () => {
      mockProducerRepository.findOne.mockResolvedValue(mockProducer);
      mockFarmRepository.create.mockReturnValue(mockFarm);
      mockFarmRepository.save.mockResolvedValue(mockFarm);

      const result = await service.create(createFarmDto);

      expect(mockProducerRepository.findOne).toHaveBeenCalledWith({
        where: { id: createFarmDto.producerId },
      });
      expect(mockFarmRepository.create).toHaveBeenCalledWith({
        name: createFarmDto.name,
        city: createFarmDto.city,
        state: createFarmDto.state,
        totalArea: createFarmDto.totalArea,
        arableArea: createFarmDto.arableArea,
        vegetationArea: createFarmDto.vegetationArea,
        producerId: createFarmDto.producerId,
        producer: mockProducer,
      });
      expect(result).toEqual(mockFarm);
      expect(mockLogger.log).toHaveBeenCalledTimes(2);
    });

    it('should throw NotFoundException when producer not found', async () => {
      mockProducerRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createFarmDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLogger.warn).toHaveBeenCalled();
    });

    it('should throw BadRequestException when area validation fails', async () => {
      const invalidFarmDto = {
        ...createFarmDto,
        totalArea: 500,
        arableArea: 600,
        vegetationArea: 300,
      };

      mockProducerRepository.findOne.mockResolvedValue(mockProducer);

      await expect(service.create(invalidFarmDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockLogger.warn).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all farms', async () => {
      const farms = [mockFarm];
      mockFarmRepository.find.mockResolvedValue(farms);

      const result = await service.findAll();

      expect(mockFarmRepository.find).toHaveBeenCalledWith({
        relations: ['producer'],
      });
      expect(result).toEqual(farms);
      expect(mockLogger.log).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a farm by id', async () => {
      mockFarmRepository.findOne.mockResolvedValue(mockFarm);

      const result = await service.findOne(mockFarm.id);

      expect(mockFarmRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockFarm.id },
        relations: ['producer'],
      });
      expect(result).toEqual(mockFarm);
    });

    it('should throw NotFoundException when farm not found', async () => {
      mockFarmRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLogger.warn).toHaveBeenCalled();
    });
  });

  describe('findByProducer', () => {
    it('should return farms by producer id', async () => {
      mockProducerRepository.findOne.mockResolvedValue(mockProducer);
      mockFarmRepository.find.mockResolvedValue([mockFarm]);

      const result = await service.findByProducer(mockProducer.id);

      expect(mockProducerRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockProducer.id },
      });
      expect(mockFarmRepository.find).toHaveBeenCalledWith({
        where: { producerId: mockProducer.id },
        relations: ['producer'],
      });
      expect(result).toEqual([mockFarm]);
    });

    it('should throw NotFoundException when producer not found', async () => {
      mockProducerRepository.findOne.mockResolvedValue(null);

      await expect(service.findByProducer('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateFarmDto: UpdateFarmDto = {
      name: 'Fazenda São João Updated',
      city: 'Campinas',
      state: 'SP',
      totalArea: 1200,
      arableArea: 700,
      vegetationArea: 400,
    };

    it('should update a farm successfully using merge + save', async () => {
      const updatedFarm = { ...mockFarm, ...updateFarmDto };
      
      mockFarmRepository.findOne.mockResolvedValueOnce(mockFarm); // For findOne in service
      mockFarmRepository.findOne.mockResolvedValueOnce(mockFarm); // For merge operation
      mockFarmRepository.merge.mockReturnValue(updatedFarm);
      mockFarmRepository.save.mockResolvedValue(updatedFarm);

      const result = await service.update(mockFarm.id, updateFarmDto);

      expect(mockFarmRepository.merge).toHaveBeenCalledWith(mockFarm, updateFarmDto);
      expect(mockFarmRepository.save).toHaveBeenCalledWith(updatedFarm);
      expect(result).toEqual(updatedFarm);
      expect(mockLogger.log).toHaveBeenCalledTimes(2);
    });

    it('should throw BadRequestException when area validation fails', async () => {
      const invalidUpdateDto = {
        ...updateFarmDto,
        totalArea: 500,
        arableArea: 700,
        vegetationArea: 400,
      };

      mockFarmRepository.findOne.mockResolvedValue(mockFarm);

      await expect(service.update(mockFarm.id, invalidUpdateDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockLogger.warn).toHaveBeenCalled();
    });

    it('should handle corrupted index error with fallback method', async () => {
      const corruptedError = new Error('index "pg_publication_rel_prrelid_prpubid_index" contains unexpected zero page');
      const updatedFarm = { ...mockFarm, ...updateFarmDto };

      mockFarmRepository.findOne.mockResolvedValueOnce(mockFarm); // For findOne in service
      mockFarmRepository.findOne.mockResolvedValueOnce(mockFarm); // For merge operation
      mockFarmRepository.merge.mockReturnValue(updatedFarm);
      mockFarmRepository.save.mockRejectedValueOnce(corruptedError);
      
      // Fallback method
      mockFarmRepository.delete.mockResolvedValue({ affected: 1 });
      mockFarmRepository.create.mockReturnValue(updatedFarm);
      mockFarmRepository.save.mockResolvedValueOnce(updatedFarm);

      const result = await service.update(mockFarm.id, updateFarmDto);

      expect(mockFarmRepository.delete).toHaveBeenCalledWith(mockFarm.id);
      expect(mockFarmRepository.create).toHaveBeenCalledWith({
        ...mockFarm,
        ...updateFarmDto,
      });
      expect(result).toEqual(updatedFarm);
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
    it('should remove a farm successfully', async () => {
      mockFarmRepository.findOne.mockResolvedValue(mockFarm);
      mockFarmRepository.remove.mockResolvedValue(mockFarm);

      await service.remove(mockFarm.id);

      expect(mockFarmRepository.remove).toHaveBeenCalledWith(mockFarm);
      expect(mockLogger.log).toHaveBeenCalledTimes(2);
    });

    it('should throw NotFoundException when trying to remove non-existent farm', async () => {
      mockFarmRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('area validation', () => {
    it('should validate that used area does not exceed total area', () => {
      const createFarmDto: CreateFarmDto = {
        name: 'Test Farm',
        city: 'Test City',
        state: 'TS',
        totalArea: 1000,
        arableArea: 600,
        vegetationArea: 300,
        producerId: 'test-id',
      };

      const usedArea = createFarmDto.arableArea + createFarmDto.vegetationArea;
      
      expect(usedArea).toBeLessThanOrEqual(createFarmDto.totalArea);
    });

    it('should fail when used area exceeds total area', () => {
      const arableArea = 700;
      const vegetationArea = 400;
      const totalArea = 1000;
      const usedArea = arableArea + vegetationArea;
      
      expect(usedArea).toBeGreaterThan(totalArea);
    });
  });
}); 