import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { FarmService } from './farm.service';
import { Farm } from '../entities/farm.entity';
import { Producer } from '../../producer/entities/producer.entity';
import { CreateFarmDto } from '../dtos/create-farm.dto';
import { UpdateFarmDto } from '../dtos/update-farm.dto';

describe('FarmService', () => {
  let service: FarmService;
  let farmRepository: jest.Mocked<Repository<Farm>>;
  let producerRepository: jest.Mocked<Repository<Producer>>;
  let logger: jest.Mocked<Logger>;

  // Dados de teste
  const mockProducer: Producer = {
    id: 'producer-123',
    name: 'João Silva',
    document: '12345678901',
    city: 'São Paulo',
    state: 'SP',
    farms: [],
  };

  const mockFarm: Farm = {
    id: 'farm-123',
    name: 'Fazenda São João',
    city: 'Ribeirão Preto',
    state: 'SP',
    totalArea: 1000,
    arableArea: 600,
    vegetationArea: 300,
    producerId: 'producer-123',
    producer: mockProducer,
    harvests: [],
    validateAreas: jest.fn(),
  };

  const createFarmDto: CreateFarmDto = {
    name: 'Fazenda São João',
    city: 'Ribeirão Preto',
    state: 'SP',
    totalArea: 1000,
    arableArea: 600,
    vegetationArea: 300,
    producerId: 'producer-123',
  };

  const updateFarmDto: UpdateFarmDto = {
    name: 'Fazenda São Pedro',
    city: 'São Carlos',
    state: 'SP',
    totalArea: 1200,
  };

  beforeEach(async () => {
    // Mock do repositório de Farm
    const mockFarmRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      merge: jest.fn(),
      delete: jest.fn(),
      remove: jest.fn(),
    };

    // Mock do repositório de Producer
    const mockProducerRepository = {
      findOne: jest.fn(),
    };

    // Mock do logger
    const mockLogger = {
      log: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

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
    farmRepository = module.get(getRepositoryToken(Farm));
    producerRepository = module.get(getRepositoryToken(Producer));
    logger = module.get(Logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a farm successfully', async () => {
      producerRepository.findOne.mockResolvedValue(mockProducer);
      farmRepository.create.mockReturnValue(mockFarm);
      farmRepository.save.mockResolvedValue(mockFarm);

      const result = await service.create(createFarmDto);

      expect(producerRepository.findOne).toHaveBeenCalledWith({
        where: { id: createFarmDto.producerId },
      });
      expect(farmRepository.create).toHaveBeenCalledWith({
        name: createFarmDto.name,
        city: createFarmDto.city,
        state: createFarmDto.state,
        totalArea: createFarmDto.totalArea,
        arableArea: createFarmDto.arableArea,
        vegetationArea: createFarmDto.vegetationArea,
        producerId: createFarmDto.producerId,
        producer: mockProducer,
      });
      expect(farmRepository.save).toHaveBeenCalledWith(mockFarm);
      expect(result).toEqual(mockFarm);
      expect(logger.log).toHaveBeenCalledTimes(2);
    });

    it('should throw NotFoundException when producer not found', async () => {
      producerRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createFarmDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(createFarmDto)).rejects.toThrow(
        'Produtor não encontrado',
      );

      expect(producerRepository.findOne).toHaveBeenCalledWith({
        where: { id: createFarmDto.producerId },
      });
      expect(farmRepository.create).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
    });

    it('should throw BadRequestException when area validation fails', async () => {
      const invalidFarmDto = {
        ...createFarmDto,
        arableArea: 700,
        vegetationArea: 400, // 700 + 400 = 1100 > 1000 (totalArea)
      };

      producerRepository.findOne.mockResolvedValue(mockProducer);

      await expect(service.create(invalidFarmDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(invalidFarmDto)).rejects.toThrow(
        'Área agricultável (700) + vegetação (400) = 1100 não pode exceder a área total (1000)',
      );

      expect(farmRepository.create).not.toHaveBeenCalled();
      expect(farmRepository.save).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
    });

    it('should handle repository errors during save', async () => {
      producerRepository.findOne.mockResolvedValue(mockProducer);
      farmRepository.create.mockReturnValue(mockFarm);
      farmRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createFarmDto)).rejects.toThrow(
        'Database error',
      );
    });

    it('should validate edge case where areas equal total', async () => {
      const edgeCaseFarmDto = {
        ...createFarmDto,
        arableArea: 600,
        vegetationArea: 400, // 600 + 400 = 1000 (totalArea) - deve ser válido
      };

      producerRepository.findOne.mockResolvedValue(mockProducer);
      farmRepository.create.mockReturnValue(mockFarm);
      farmRepository.save.mockResolvedValue(mockFarm);

      const result = await service.create(edgeCaseFarmDto);

      expect(result).toEqual(mockFarm);
      expect(farmRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all farms with producer relation', async () => {
      const mockFarms = [mockFarm, { ...mockFarm, id: 'farm-456', validateAreas: jest.fn() }];
      farmRepository.find.mockResolvedValue(mockFarms);

      const result = await service.findAll();

      expect(farmRepository.find).toHaveBeenCalledWith({
        relations: ['producer'],
      });
      expect(result).toEqual(mockFarms);
      expect(logger.log).toHaveBeenCalled();
    });

    it('should return empty array when no farms exist', async () => {
      farmRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should handle repository errors', async () => {
      farmRepository.find.mockRejectedValue(new Error('Database error'));

      await expect(service.findAll()).rejects.toThrow('Database error');
    });
  });

  describe('findOne', () => {
    it('should return a farm by id', async () => {
      farmRepository.findOne.mockResolvedValue(mockFarm);

      const result = await service.findOne(mockFarm.id);

      expect(farmRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockFarm.id },
        relations: ['producer'],
      });
      expect(result).toEqual(mockFarm);
      expect(logger.debug).toHaveBeenCalled();
    });

    it('should throw NotFoundException when farm not found', async () => {
      farmRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        'Fazenda não encontrada',
      );

      expect(logger.warn).toHaveBeenCalled();
    });
  });

  describe('findByProducer', () => {
    it('should return farms for a specific producer', async () => {
      const mockFarms = [mockFarm];
      producerRepository.findOne.mockResolvedValue(mockProducer);
      farmRepository.find.mockResolvedValue(mockFarms);

      const result = await service.findByProducer('producer-123');

      expect(producerRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'producer-123' },
      });
      expect(farmRepository.find).toHaveBeenCalledWith({
        where: { producerId: 'producer-123' },
        relations: ['producer'],
      });
      expect(result).toEqual(mockFarms);
    });

    it('should throw NotFoundException when producer not found', async () => {
      producerRepository.findOne.mockResolvedValue(null);

      await expect(service.findByProducer('non-existent-producer')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findByProducer('non-existent-producer')).rejects.toThrow(
        'Produtor não encontrado',
      );

      expect(farmRepository.find).not.toHaveBeenCalled();
    });

    it('should return empty array when producer has no farms', async () => {
      producerRepository.findOne.mockResolvedValue(mockProducer);
      farmRepository.find.mockResolvedValue([]);

      const result = await service.findByProducer('producer-123');

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe('update', () => {
    it('should update a farm successfully', async () => {
      const updatedFarm = { ...mockFarm, ...updateFarmDto, validateAreas: jest.fn() };
      
      farmRepository.findOne.mockResolvedValueOnce(mockFarm); // Para findOne do service
      farmRepository.findOne.mockResolvedValueOnce(mockFarm); // Para findOne interno no update
      farmRepository.merge.mockReturnValue(updatedFarm);
      farmRepository.save.mockResolvedValue(updatedFarm);

      const result = await service.update(mockFarm.id, updateFarmDto);

      expect(result).toEqual(updatedFarm);
      expect(farmRepository.merge).toHaveBeenCalledWith(mockFarm, updateFarmDto);
      expect(farmRepository.save).toHaveBeenCalledWith(updatedFarm);
      expect(logger.log).toHaveBeenCalledTimes(2);
    });

    it('should throw NotFoundException when farm not found', async () => {
      farmRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', updateFarmDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should validate areas when updating area fields', async () => {
      const invalidUpdateDto = {
        arableArea: 800,
        vegetationArea: 500, // 800 + 500 = 1300 > 1000 (totalArea)
      };

      farmRepository.findOne.mockResolvedValue(mockFarm);

      await expect(
        service.update(mockFarm.id, invalidUpdateDto),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.update(mockFarm.id, invalidUpdateDto),
      ).rejects.toThrow(
        'não pode exceder a área total',
      );
    });

    it('should handle partial updates correctly', async () => {
      const partialUpdate = { name: 'Novo Nome' };
      const updatedFarm = { ...mockFarm, name: 'Novo Nome', validateAreas: jest.fn() };
      
      farmRepository.findOne.mockResolvedValueOnce(mockFarm);
      farmRepository.findOne.mockResolvedValueOnce(mockFarm);
      farmRepository.merge.mockReturnValue(updatedFarm);
      farmRepository.save.mockResolvedValue(updatedFarm);

      const result = await service.update(mockFarm.id, partialUpdate);

      expect(result.name).toBe('Novo Nome');
      expect(result.totalArea).toBe(mockFarm.totalArea); // Mantém valores originais
    });
  });

  describe('remove', () => {
    it('should remove a farm successfully', async () => {
      farmRepository.findOne.mockResolvedValue(mockFarm);
      farmRepository.remove.mockResolvedValue(mockFarm);

      await service.remove(mockFarm.id);

      expect(farmRepository.remove).toHaveBeenCalledWith(mockFarm);
      expect(logger.log).toHaveBeenCalledTimes(2);
    });

    it('should throw NotFoundException when farm not found', async () => {
      farmRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle repository errors during deletion', async () => {
      farmRepository.findOne.mockResolvedValue(mockFarm);
      farmRepository.remove.mockRejectedValue(new Error('Database error'));

      await expect(service.remove(mockFarm.id)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('Area validation edge cases', () => {
    it('should allow zero vegetation area', async () => {
      const farmWithZeroVegetation = {
        ...createFarmDto,
        arableArea: 1000,
        vegetationArea: 0,
      };

      producerRepository.findOne.mockResolvedValue(mockProducer);
      farmRepository.create.mockReturnValue(mockFarm);
      farmRepository.save.mockResolvedValue(mockFarm);

      const result = await service.create(farmWithZeroVegetation);

      expect(result).toEqual(mockFarm);
    });

    it('should allow zero arable area', async () => {
      const farmWithZeroArable = {
        ...createFarmDto,
        arableArea: 0,
        vegetationArea: 1000,
      };

      producerRepository.findOne.mockResolvedValue(mockProducer);
      farmRepository.create.mockReturnValue(mockFarm);
      farmRepository.save.mockResolvedValue(mockFarm);

      const result = await service.create(farmWithZeroArable);

      expect(result).toEqual(mockFarm);
    });

    it('should handle negative areas by applying sum validation', async () => {
      const farmWithNegativeArea = {
        ...createFarmDto,
        totalArea: 1000,
        arableArea: -100, // Área negativa
        vegetationArea: 500, // -100 + 500 = 400 < 1000 (válido)
      };

      producerRepository.findOne.mockResolvedValue(mockProducer);
      farmRepository.create.mockReturnValue(mockFarm);
      farmRepository.save.mockResolvedValue(mockFarm);

      // A validação de área negativa deveria ser feita no DTO
      // Mas a regra de soma ainda é aplicada (-100 + 500 = 400 < 1000)
      const result = await service.create(farmWithNegativeArea);

      expect(result).toEqual(mockFarm);
      expect(farmRepository.save).toHaveBeenCalled();
    });

    it('should handle decimal areas correctly', async () => {
      const farmWithDecimalAreas = {
        ...createFarmDto,
        totalArea: 1000.5,
        arableArea: 600.3,
        vegetationArea: 400.2, // 600.3 + 400.2 = 1000.5
      };

      producerRepository.findOne.mockResolvedValue(mockProducer);
      farmRepository.create.mockReturnValue(mockFarm);
      farmRepository.save.mockResolvedValue(mockFarm);

      const result = await service.create(farmWithDecimalAreas);

      expect(result).toEqual(mockFarm);
    });
  });

  describe('Logging behavior', () => {
    it('should log farm creation with all relevant data', async () => {
      producerRepository.findOne.mockResolvedValue(mockProducer);
      farmRepository.create.mockReturnValue(mockFarm);
      farmRepository.save.mockResolvedValue(mockFarm);

      await service.create(createFarmDto);

      expect(logger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          operation: 'farm.create',
          producerId: createFarmDto.producerId,
          farmName: createFarmDto.name,
          totalArea: createFarmDto.totalArea,
        }),
        'Iniciando criação de fazenda',
      );

      expect(logger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          operation: 'farm.create',
          farmId: mockFarm.id,
          farmName: mockFarm.name,
          duration: expect.any(Number),
        }),
        'Fazenda criada com sucesso',
      );
    });

    it('should log warnings for business rule violations', async () => {
      const invalidFarmDto = {
        ...createFarmDto,
        arableArea: 700,
        vegetationArea: 400,
      };

      producerRepository.findOne.mockResolvedValue(mockProducer);

      await expect(service.create(invalidFarmDto)).rejects.toThrow();

      expect(logger.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          operation: 'farm.create',
          totalArea: invalidFarmDto.totalArea,
          usedArea: 1100,
        }),
        'Tentativa de criar fazenda com áreas inválidas',
      );
    });
  });
}); 