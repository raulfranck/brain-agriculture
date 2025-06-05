import { Test, TestingModule } from '@nestjs/testing';
import { FarmController } from './farm.controller';
import { FarmService } from '../services/farm.service';
import { CreateFarmDto } from '../dtos/create-farm.dto';
import { UpdateFarmDto } from '../dtos/update-farm.dto';
import { Farm } from '../entities/farm.entity';

describe('FarmController', () => {
  let controller: FarmController;
  let service: FarmService;

  const mockFarmService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByProducer: jest.fn(),
  };

  const mockFarm: Farm = {
    id: '987e6543-e21b-12d3-a456-426614174000',
    name: 'Fazenda São João',
    city: 'Ribeirão Preto',
    state: 'SP',
    totalArea: 1000,
    arableArea: 600,
    vegetationArea: 300,
    producerId: '123e4567-e89b-12d3-a456-426614174000',
    producer: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'João Silva',
      document: '12345678901',
      city: 'São Paulo',
      state: 'SP',
      farms: [],
    },
    harvests: [],
    validateAreas: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FarmController],
      providers: [
        {
          provide: FarmService,
          useValue: mockFarmService,
        },
      ],
    }).compile();

    controller = module.get<FarmController>(FarmController);
    service = module.get<FarmService>(FarmService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a farm successfully', async () => {
      const createFarmDto: CreateFarmDto = {
        name: 'Fazenda São João',
        city: 'Ribeirão Preto',
        state: 'SP',
        totalArea: 1000,
        arableArea: 600,
        vegetationArea: 300,
        producerId: '123e4567-e89b-12d3-a456-426614174000',
      };

      mockFarmService.create.mockResolvedValue(mockFarm);

      const result = await controller.create(createFarmDto);

      expect(service.create).toHaveBeenCalledWith(createFarmDto);
      expect(result).toEqual(mockFarm);
    });
  });

  describe('findAll', () => {
    it('should return all farms', async () => {
      const farms = [mockFarm];
      mockFarmService.findAll.mockResolvedValue(farms);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(farms);
    });
  });

  describe('findOne', () => {
    it('should return a farm by id', async () => {
      mockFarmService.findOne.mockResolvedValue(mockFarm);

      const result = await controller.findOne(mockFarm.id);

      expect(service.findOne).toHaveBeenCalledWith(mockFarm.id);
      expect(result).toEqual(mockFarm);
    });
  });

  describe('findByProducer', () => {
    it('should return farms by producer id', async () => {
      const farms = [mockFarm];
      mockFarmService.findByProducer.mockResolvedValue(farms);

      const result = await controller.findByProducer(mockFarm.producerId);

      expect(service.findByProducer).toHaveBeenCalledWith(mockFarm.producerId);
      expect(result).toEqual(farms);
    });
  });

  describe('updatePut', () => {
    it('should update a farm using PUT', async () => {
      const updateFarmDto: UpdateFarmDto = {
        name: 'Fazenda São João Updated',
        city: 'Campinas',
        state: 'SP',
        totalArea: 1200,
        arableArea: 700,
        vegetationArea: 400,
      };
      const updatedFarm = { ...mockFarm, ...updateFarmDto };

      mockFarmService.update.mockResolvedValue(updatedFarm);

      const result = await controller.updatePut(mockFarm.id, updateFarmDto);

      expect(service.update).toHaveBeenCalledWith(mockFarm.id, updateFarmDto);
      expect(result).toEqual(updatedFarm);
    });
  });

  describe('update (PATCH)', () => {
    it('should update a farm using PATCH', async () => {
      const updateFarmDto: UpdateFarmDto = {
        name: 'Fazenda São João Updated',
      };
      const updatedFarm = { ...mockFarm, ...updateFarmDto };

      mockFarmService.update.mockResolvedValue(updatedFarm);

      const result = await controller.update(mockFarm.id, updateFarmDto);

      expect(service.update).toHaveBeenCalledWith(mockFarm.id, updateFarmDto);
      expect(result).toEqual(updatedFarm);
    });
  });

  describe('remove', () => {
    it('should remove a farm', async () => {
      mockFarmService.remove.mockResolvedValue(undefined);

      await controller.remove(mockFarm.id);

      expect(service.remove).toHaveBeenCalledWith(mockFarm.id);
    });
  });
}); 