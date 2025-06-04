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
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FarmService } from '../services/farm.service';
import { CreateFarmDto } from '../dtos/create-farm.dto';
import { UpdateFarmDto } from '../dtos/update-farm.dto';
import { Farm } from '../entities/farm.entity';

@ApiTags('farms')
@Controller('farms')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar nova fazenda' })
  @ApiResponse({
    status: 201,
    description: 'Fazenda criada com sucesso',
    type: Farm,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou áreas incompatíveis' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  async create(@Body() createFarmDto: CreateFarmDto): Promise<Farm> {
    return await this.farmService.create(createFarmDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as fazendas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de fazendas retornada com sucesso',
    type: [Farm],
  })
  async findAll(): Promise<Farm[]> {
    return await this.farmService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar fazenda por ID' })
  @ApiParam({ name: 'id', description: 'ID da fazenda (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Fazenda encontrada',
    type: Farm,
  })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Farm> {
    return await this.farmService.findOne(id);
  }

  @Get('producer/:producerId')
  @ApiOperation({ summary: 'Listar fazendas de um produtor' })
  @ApiParam({ name: 'producerId', description: 'ID do produtor (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Fazendas do produtor retornadas com sucesso',
    type: [Farm],
  })
  async findByProducer(@Param('producerId', ParseUUIDPipe) producerId: string): Promise<Farm[]> {
    return await this.farmService.findByProducer(producerId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar fazenda' })
  @ApiParam({ name: 'id', description: 'ID da fazenda (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Fazenda atualizada com sucesso',
    type: Farm,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou áreas incompatíveis' })
  @ApiResponse({ status: 404, description: 'Fazenda ou produtor não encontrado' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFarmDto: UpdateFarmDto,
  ): Promise<Farm> {
    return await this.farmService.update(id, updateFarmDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir fazenda' })
  @ApiParam({ name: 'id', description: 'ID da fazenda (UUID)' })
  @ApiResponse({ status: 204, description: 'Fazenda excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.farmService.remove(id);
  }
} 