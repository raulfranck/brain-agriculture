import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Endpoint raiz da aplicação' })
  @ApiResponse({ 
    status: 200, 
    description: 'Retorna informações básicas da API',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Brain Agriculture API is running!' },
        version: { type: 'string', example: '1.0.0' },
        docs: { type: 'string', example: '/api/docs' }
      }
    }
  })
  getHello(): object {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check da aplicação' })
  @ApiResponse({ 
    status: 200, 
    description: 'Status de saúde da aplicação',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2025-06-04T12:00:00.000Z' },
        uptime: { type: 'number', example: 123.456 },
        environment: { type: 'string', example: 'development' }
      }
    }
  })
  getHealth(): object {
    return this.appService.getHealth();
  }
}
