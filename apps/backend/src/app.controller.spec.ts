import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: jest.Mocked<AppService>;

  beforeEach(async () => {
    const mockAppService = {
      getHello: jest.fn(),
      getHealth: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get(AppService);
  });

  describe('root', () => {
    it('should return API info object', () => {
      const apiInfo = {
        message: 'Brain Agriculture API is running!',
        version: '1.0.0',
        docs: '/api/docs',
        endpoints: {
          producers: '/producers',
          farms: '/farms',
          health: '/health'
        }
      };
      appService.getHello.mockReturnValue(apiInfo);
      
      expect(appController.getHello()).toEqual(apiInfo);
      expect(appService.getHello).toHaveBeenCalled();
    });
  });

  describe('health', () => {
    it('should return health check object', () => {
      const healthResponse = { 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: 123,
        environment: 'test',
        database: 'connected',
        memory: { used: 50, total: 100 }
      };
      appService.getHealth.mockReturnValue(healthResponse);
      
      expect(appController.getHealth()).toEqual(healthResponse);
      expect(appService.getHealth).toHaveBeenCalled();
    });
  });
});
