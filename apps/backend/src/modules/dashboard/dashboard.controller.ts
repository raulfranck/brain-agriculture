import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Obter estatísticas do dashboard' })
  @ApiResponse({ 
    status: 200, 
    description: 'Estatísticas obtidas com sucesso',
    schema: {
      type: 'object',
      properties: {
        totalFarms: { type: 'number', example: 10 },
        totalHectares: { type: 'number', example: 1500.5 },
        farmsByState: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              state: { type: 'string', example: 'SP' },
              count: { type: 'number', example: 5 }
            }
          }
        },
        farmsByCrop: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              crop: { type: 'string', example: 'Soja' },
              count: { type: 'number', example: 3 }
            }
          }
        },
        landUse: {
          type: 'object',
          properties: {
            arable: { type: 'number', example: 800.5 },
            vegetation: { type: 'number', example: 700.0 }
          }
        }
      }
    }
  })
  async getStats() {
    return this.dashboardService.getStats();
  }
} 