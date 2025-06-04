import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { HarvestService } from './harvest.service';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';
import { Harvest } from './entities/harvest.entity';

@ApiTags('Safras')
@Controller('harvests')
export class HarvestController {
  constructor(private readonly harvestService: HarvestService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova safra' })
  @ApiResponse({ status: 201, description: 'Safra criada com sucesso', type: Harvest })
  @ApiResponse({ status: 400, description: 'Safra já existe para esta fazenda, ano e cultura' })
  @ApiResponse({ status: 404, description: 'Fazenda ou cultura não encontrada' })
  async create(@Body() createHarvestDto: CreateHarvestDto): Promise<Harvest> {
    return await this.harvestService.create(createHarvestDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as safras ou por fazenda' })
  @ApiQuery({ name: 'farmId', required: false, description: 'ID da fazenda para filtrar' })
  @ApiResponse({ status: 200, description: 'Lista de safras', type: [Harvest] })
  async findAll(@Query('farmId') farmId?: string): Promise<Harvest[]> {
    if (farmId) {
      return await this.harvestService.findByFarm(farmId);
    }
    return await this.harvestService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar safra por ID' })
  @ApiResponse({ status: 200, description: 'Safra encontrada', type: Harvest })
  @ApiResponse({ status: 404, description: 'Safra não encontrada' })
  async findOne(@Param('id') id: string): Promise<Harvest> {
    return await this.harvestService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar safra' })
  @ApiResponse({ status: 200, description: 'Safra atualizada com sucesso', type: Harvest })
  @ApiResponse({ status: 404, description: 'Safra não encontrada' })
  async update(
    @Param('id') id: string,
    @Body() updateHarvestDto: UpdateHarvestDto,
  ): Promise<Harvest> {
    return await this.harvestService.update(id, updateHarvestDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover safra' })
  @ApiResponse({ status: 204, description: 'Safra removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Safra não encontrada' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.harvestService.remove(id);
  }
} 