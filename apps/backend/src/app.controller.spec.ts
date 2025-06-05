import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  const mockLogger = {
    log: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health check', () => {
    it('should return health status', () => {
      const result = appController.getHealth();
      expect(result).toEqual({
        status: 'ok',
        timestamp: expect.any(String),
        uptime: expect.any(Number),
        environment: expect.any(String),
        database: 'connected',
        memory: expect.objectContaining({
          total: expect.any(Number),
          used: expect.any(Number),
        }),
      });
    });
  });
});
