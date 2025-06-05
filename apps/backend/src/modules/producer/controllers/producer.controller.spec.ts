import { Test, TestingModule } from '@nestjs/testing';
import { ProducerController } from './producer.controller';
import { ProducerService } from '../services/producer.service';
import { CreateProducerDto } from '../dtos/create-producer.dto';
import { UpdateProducerDto } from '../dtos/update-producer.dto';
import { Producer } from '../entities/producer.entity';

describe('ProducerController', () => {
  let controller: ProducerController;
  let service: ProducerService;

  const mockProducerService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
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
      controllers: [ProducerController],
      providers: [
        {
          provide: ProducerService,
          useValue: mockProducerService,
        },
      ],
    }).compile();

    controller = module.get<ProducerController>(ProducerController);
    service = module.get<ProducerService>(ProducerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a producer successfully', async () => {
      const createProducerDto: CreateProducerDto = {
        name: 'João Silva',
        document: '12345678901',
        city: 'São Paulo',
        state: 'SP',
      };

      mockProducerService.create.mockResolvedValue(mockProducer);

      const result = await controller.create(createProducerDto);

      expect(service.create).toHaveBeenCalledWith(createProducerDto);
      expect(result).toEqual(mockProducer);
    });
  });

  describe('findAll', () => {
    it('should return all producers', async () => {
      const producers = [mockProducer];
      mockProducerService.findAll.mockResolvedValue(producers);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(producers);
    });
  });

  describe('findOne', () => {
    it('should return a producer by id', async () => {
      mockProducerService.findOne.mockResolvedValue(mockProducer);

      const result = await controller.findOne(mockProducer.id);

      expect(service.findOne).toHaveBeenCalledWith(mockProducer.id);
      expect(result).toEqual(mockProducer);
    });
  });

  describe('updatePut', () => {
    it('should update a producer using PUT', async () => {
      const updateProducerDto: UpdateProducerDto = {
        name: 'João Silva Updated',
        city: 'Rio de Janeiro',
        state: 'RJ',
      };
      const updatedProducer = { ...mockProducer, ...updateProducerDto };

      mockProducerService.update.mockResolvedValue(updatedProducer);

      const result = await controller.updatePut(mockProducer.id, updateProducerDto);

      expect(service.update).toHaveBeenCalledWith(mockProducer.id, updateProducerDto);
      expect(result).toEqual(updatedProducer);
    });
  });

  describe('update (PATCH)', () => {
    it('should update a producer using PATCH', async () => {
      const updateProducerDto: UpdateProducerDto = {
        name: 'João Silva Updated',
      };
      const updatedProducer = { ...mockProducer, ...updateProducerDto };

      mockProducerService.update.mockResolvedValue(updatedProducer);

      const result = await controller.update(mockProducer.id, updateProducerDto);

      expect(service.update).toHaveBeenCalledWith(mockProducer.id, updateProducerDto);
      expect(result).toEqual(updatedProducer);
    });
  });

  describe('remove', () => {
    it('should remove a producer', async () => {
      mockProducerService.remove.mockResolvedValue(undefined);

      await controller.remove(mockProducer.id);

      expect(service.remove).toHaveBeenCalledWith(mockProducer.id);
    });
  });
}); 