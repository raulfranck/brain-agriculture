import { Injectable, Inject } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

@Injectable()
export class AppService {
  constructor(
    @Inject(Logger)
    private readonly logger: Logger,
  ) {}

  getHello(): object {
    this.logger.debug({
      operation: 'app.getHello',
    }, 'Endpoint raiz acessado');

    return {
      message: 'Brain Agriculture API is running!',
      version: '1.0.0',
      docs: '/api/docs',
      endpoints: {
        producers: '/producers',
        farms: '/farms',
        health: '/health'
      }
    };
  }

  getHealth(): object {
    const uptime = process.uptime();
    const memory = process.memoryUsage();
    
    const healthData = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime,
      environment: process.env.NODE_ENV || 'development',
      database: 'connected',
      memory: {
        used: Math.round(memory.heapUsed / 1024 / 1024),
        total: Math.round(memory.heapTotal / 1024 / 1024)
      }
    };

    this.logger.debug({
      operation: 'app.getHealth',
      uptime,
      memoryUsed: healthData.memory.used,
      memoryTotal: healthData.memory.total,
    }, 'Health check executado');

    return healthData;
  }
}
