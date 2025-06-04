import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
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
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: 'connected',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      }
    };
  }
}
