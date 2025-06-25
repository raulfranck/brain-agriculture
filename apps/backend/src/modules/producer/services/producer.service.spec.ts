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
  let repository: jest.Mocked<Repository<Producer>>;
  let logger: jest.Mocked<Logger>;

  // Dados de teste
  const mockProducer: Producer = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'João Silva',
    document: '12345678901',
    city: 'São Paulo',
    state: 'SP',
    farms: [],
  };

  const createProducerDto: CreateProducerDto = {
    name: 'João Silva',
    document: '12345678901',
    city: 'São Paulo',
    state: 'SP',
  };

  const updateProducerDto: UpdateProducerDto = {
    name: 'João Santos',
    city: 'Rio de Janeiro',
    state: 'RJ',
  };

  beforeEach(async () => {
    // Mock do repositório
    const mockRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      merge: jest.fn(),
      delete: jest.fn(),
      remove: jest.fn(),
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
    repository = module.get(getRepositoryToken(Producer));
    logger = module.get(Logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a producer successfully', async () => {
      repository.findOne.mockResolvedValue(null); // Não existe produtor com mesmo documento
      repository.create.mockReturnValue(mockProducer);
      repository.save.mockResolvedValue(mockProducer);

      const result = await service.create(createProducerDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { document: createProducerDto.document },
      });
      expect(repository.create).toHaveBeenCalledWith(createProducerDto);
      expect(repository.save).toHaveBeenCalledWith(mockProducer);
      expect(result).toEqual(mockProducer);
      expect(logger.log).toHaveBeenCalledTimes(2); // Log inicial e final
    });

    it('should throw ConflictException when document already exists', async () => {
      repository.findOne.mockResolvedValue(mockProducer); // Já existe

      await expect(service.create(createProducerDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(createProducerDto)).rejects.toThrow(
        'Já existe um produtor com este documento',
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { document: createProducerDto.document },
      });
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      repository.findOne.mockResolvedValue(null);
      repository.create.mockReturnValue(mockProducer);
      repository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createProducerDto)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('findAll', () => {
    it('should return all producers with farms', async () => {
      const mockProducers = [mockProducer, { ...mockProducer, id: 'another-id' }];
      repository.find.mockResolvedValue(mockProducers);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        relations: ['farms'],
      });
      expect(result).toEqual(mockProducers);
      expect(logger.log).toHaveBeenCalled();
    });

    it('should return empty array when no producers exist', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should handle repository errors', async () => {
      repository.find.mockRejectedValue(new Error('Database error'));

      await expect(service.findAll()).rejects.toThrow('Database error');
    });
  });

  describe('findOne', () => {
    it('should return a producer by id', async () => {
      repository.findOne.mockResolvedValue(mockProducer);

      const result = await service.findOne(mockProducer.id);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: mockProducer.id },
        relations: ['farms'],
      });
      expect(result).toEqual(mockProducer);
      expect(logger.debug).toHaveBeenCalled();
    });

    it('should throw NotFoundException when producer not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        'Produtor não encontrado',
      );

      expect(logger.warn).toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      repository.findOne.mockRejectedValue(new Error('Database error'));

      await expect(service.findOne(mockProducer.id)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('update', () => {
    it('should update a producer successfully', async () => {
      const updatedProducer = { ...mockProducer, ...updateProducerDto };
      
      // Mock findOne para findOne interno
      repository.findOne
        .mockResolvedValueOnce(mockProducer) // Para findOne do service
        .mockResolvedValueOnce(mockProducer); // Para findOne interno no update
      
      repository.merge.mockReturnValue(updatedProducer);
      repository.save.mockResolvedValue(updatedProducer);

      const result = await service.update(mockProducer.id, updateProducerDto);

      expect(result).toEqual(updatedProducer);
      expect(repository.merge).toHaveBeenCalledWith(mockProducer, updateProducerDto);
      expect(repository.save).toHaveBeenCalledWith(updatedProducer);
      expect(logger.log).toHaveBeenCalledTimes(2); // Log inicial e final
    });

    it('should throw NotFoundException when producer not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', updateProducerDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when updating to existing document', async () => {
      const existingProducer = { ...mockProducer, id: 'different-id' };
      const updateWithDocument = { ...updateProducerDto, document: '98765432100' };

      repository.findOne
        .mockResolvedValueOnce(mockProducer) // Para findOne do service
        .mockResolvedValueOnce(mockProducer) // Para findOne interno
        .mockResolvedValueOnce(existingProducer); // Para verificação de documento

      await expect(
        service.update(mockProducer.id, updateWithDocument),
      ).rejects.toThrow(ConflictException);
    });

    it('should handle corrupted index error with alternative method', async () => {
      const updatedProducer = { ...mockProducer, ...updateProducerDto };
      const corruptedIndexError = new Error('unexpected zero page');
      
      repository.findOne
        .mockResolvedValueOnce(mockProducer) // Para findOne do service
        .mockResolvedValueOnce(mockProducer); // Para findOne interno no update
      
      repository.merge.mockReturnValue(updatedProducer);
      repository.save.mockRejectedValueOnce(corruptedIndexError); // Primeiro save falha
      repository.delete.mockResolvedValue({ affected: 1, raw: {} });
      repository.create.mockReturnValue(updatedProducer);
      repository.save.mockResolvedValueOnce(updatedProducer); // Segundo save sucesso

      const result = await service.update(mockProducer.id, updateProducerDto);

      expect(result).toEqual(updatedProducer);
      expect(repository.delete).toHaveBeenCalledWith(mockProducer.id);
      expect(repository.create).toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
    });

    it('should rethrow non-corrupted index errors', async () => {
      const genericError = new Error('Generic database error');
      
      repository.findOne
        .mockResolvedValueOnce(mockProducer)
        .mockResolvedValueOnce(mockProducer);
      
      repository.merge.mockReturnValue(mockProducer);
      repository.save.mockRejectedValue(genericError);

      await expect(
        service.update(mockProducer.id, updateProducerDto),
      ).rejects.toThrow('Generic database error');
      
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a producer successfully', async () => {
      repository.findOne.mockResolvedValue(mockProducer);
      repository.remove.mockResolvedValue(mockProducer);

      await service.remove(mockProducer.id);

      expect(repository.remove).toHaveBeenCalledWith(mockProducer);
      expect(logger.log).toHaveBeenCalledTimes(2); // Log inicial e final
    });

    it('should throw NotFoundException when producer not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle repository errors', async () => {
      repository.findOne.mockResolvedValue(mockProducer);
      repository.remove.mockRejectedValue(new Error('Database error'));

      await expect(service.remove(mockProducer.id)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('Integration scenarios', () => {
    it('should handle multiple producers with different documents', async () => {
      const producer1 = { ...mockProducer };
      const producer2 = { ...mockProducer, id: 'id-2', document: '98765432100' };
      
      repository.find.mockResolvedValue([producer1, producer2]);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].document).toBe('12345678901');
      expect(result[1].document).toBe('98765432100');
    });

    it('should maintain data consistency during operations', async () => {
      // Simular cenário onde dados são consistentes
      repository.findOne.mockImplementation((options: any) => {
        if (options.where.id === mockProducer.id) {
          return Promise.resolve(mockProducer);
        }
        return Promise.resolve(null);
      });

      const found = await service.findOne(mockProducer.id);
      expect(found.id).toBe(mockProducer.id);
      
      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Logging behavior', () => {
    it('should log all operations with proper context', async () => {
      repository.findOne.mockResolvedValue(null);
      repository.create.mockReturnValue(mockProducer);
      repository.save.mockResolvedValue(mockProducer);

      await service.create(createProducerDto);

      expect(logger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          operation: 'producer.create',
          document: createProducerDto.document,
        }),
        'Iniciando criação de produtor',
      );

      expect(logger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          operation: 'producer.create',
          producerId: mockProducer.id,
          duration: expect.any(Number),
        }),
        'Produtor criado com sucesso',
      );
    });

    it('should log warnings for business rule violations', async () => {
      repository.findOne.mockResolvedValue(mockProducer);

      await expect(service.create(createProducerDto)).rejects.toThrow();

      expect(logger.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          operation: 'producer.create',
          document: createProducerDto.document,
          existingProducerId: mockProducer.id,
        }),
        'Tentativa de criar produtor com documento duplicado',
      );
    });
  });
}); 