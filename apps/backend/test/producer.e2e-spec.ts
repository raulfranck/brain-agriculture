import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Producer } from '../src/modules/producer/entities/producer.entity';
import { Farm } from '../src/modules/farm/entities/farm.entity';

describe('ProducerController (e2e)', () => {
  let app: INestApplication;
  let createdProducerId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432', 10),
          username: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASS || 'postgres',
          database: process.env.DB_NAME || 'brain_agriculture_test',
          entities: [Producer, Farm],
          synchronize: true, // Only for tests
          dropSchema: true, // Clean database for each test run
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/producers (POST)', () => {
    it('should create a new producer', () => {
      const createProducerDto = {
        name: 'João Silva E2E',
        document: '12345678901',
        city: 'São Paulo',
        state: 'SP',
      };

      return request(app.getHttpServer())
        .post('/producers')
        .send(createProducerDto)
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.name).toBe(createProducerDto.name);
          expect(response.body.document).toBe(createProducerDto.document);
          expect(response.body.city).toBe(createProducerDto.city);
          expect(response.body.state).toBe(createProducerDto.state);
          createdProducerId = response.body.id;
        });
    });

    it('should return 409 when creating producer with duplicate document', () => {
      const duplicateProducerDto = {
        name: 'Maria Silva',
        document: '12345678901', // Same document as previous test
        city: 'Rio de Janeiro',
        state: 'RJ',
      };

      return request(app.getHttpServer())
        .post('/producers')
        .send(duplicateProducerDto)
        .expect(409);
    });

    it('should return 400 when creating producer with invalid data', () => {
      const invalidProducerDto = {
        name: '', // Empty name
        document: '123', // Invalid document
        city: 'São Paulo',
        state: 'SP',
      };

      return request(app.getHttpServer())
        .post('/producers')
        .send(invalidProducerDto)
        .expect(400);
    });
  });

  describe('/producers (GET)', () => {
    it('should return all producers', () => {
      return request(app.getHttpServer())
        .get('/producers')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBeGreaterThan(0);
          expect(response.body[0]).toHaveProperty('id');
          expect(response.body[0]).toHaveProperty('name');
          expect(response.body[0]).toHaveProperty('document');
        });
    });
  });

  describe('/producers/:id (GET)', () => {
    it('should return a specific producer', () => {
      return request(app.getHttpServer())
        .get(`/producers/${createdProducerId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(createdProducerId);
          expect(response.body).toHaveProperty('name');
          expect(response.body).toHaveProperty('document');
          expect(response.body).toHaveProperty('farms');
        });
    });

    it('should return 404 for non-existent producer', () => {
      const nonExistentId = '123e4567-e89b-12d3-a456-426614174999';
      return request(app.getHttpServer())
        .get(`/producers/${nonExistentId}`)
        .expect(404);
    });

    it('should return 400 for invalid UUID', () => {
      return request(app.getHttpServer())
        .get('/producers/invalid-uuid')
        .expect(400);
    });
  });

  describe('/producers/:id (PUT)', () => {
    it('should update a producer', () => {
      const updateProducerDto = {
        name: 'João Silva Updated E2E',
        document: '12345678901',
        city: 'Campinas',
        state: 'SP',
      };

      return request(app.getHttpServer())
        .put(`/producers/${createdProducerId}`)
        .send(updateProducerDto)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(createdProducerId);
          expect(response.body.name).toBe(updateProducerDto.name);
          expect(response.body.city).toBe(updateProducerDto.city);
        });
    });

    it('should return 404 when updating non-existent producer', () => {
      const nonExistentId = '123e4567-e89b-12d3-a456-426614174999';
      const updateProducerDto = {
        name: 'Test Update',
        document: '98765432100',
        city: 'Test City',
        state: 'TS',
      };

      return request(app.getHttpServer())
        .put(`/producers/${nonExistentId}`)
        .send(updateProducerDto)
        .expect(404);
    });
  });

  describe('/producers/:id (PATCH)', () => {
    it('should partially update a producer', () => {
      const patchProducerDto = {
        city: 'Santos',
      };

      return request(app.getHttpServer())
        .patch(`/producers/${createdProducerId}`)
        .send(patchProducerDto)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(createdProducerId);
          expect(response.body.city).toBe(patchProducerDto.city);
          // Other fields should remain unchanged
          expect(response.body.name).toBe('João Silva Updated E2E');
        });
    });
  });

  describe('/producers/:id (DELETE)', () => {
    it('should delete a producer', () => {
      return request(app.getHttpServer())
        .delete(`/producers/${createdProducerId}`)
        .expect(204);
    });

    it('should return 404 when deleting non-existent producer', () => {
      return request(app.getHttpServer())
        .delete(`/producers/${createdProducerId}`) // Already deleted
        .expect(404);
    });
  });

  describe('Health Check', () => {
    it('/health (GET)', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('status');
          expect(response.body.status).toBe('ok');
        });
    });
  });
}); 