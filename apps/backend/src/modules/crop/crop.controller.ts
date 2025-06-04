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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CropService } from './crop.service';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { Crop } from './entities/crop.entity';

@ApiTags('Culturas')
@Controller('crops')
export class CropController {
  constructor(private readonly cropService: CropService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova cultura' })
  @ApiResponse({ status: 201, description: 'Cultura criada com sucesso', type: Crop })
  @ApiResponse({ status: 409, description: 'Cultura com este nome já existe' })
  async create(@Body() createCropDto: CreateCropDto): Promise<Crop> {
    return await this.cropService.create(createCropDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as culturas' })
  @ApiResponse({ status: 200, description: 'Lista de culturas', type: [Crop] })
  async findAll(): Promise<Crop[]> {
    return await this.cropService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cultura por ID' })
  @ApiResponse({ status: 200, description: 'Cultura encontrada', type: Crop })
  @ApiResponse({ status: 404, description: 'Cultura não encontrada' })
  async findOne(@Param('id') id: string): Promise<Crop> {
    return await this.cropService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar cultura' })
  @ApiResponse({ status: 200, description: 'Cultura atualizada com sucesso', type: Crop })
  @ApiResponse({ status: 404, description: 'Cultura não encontrada' })
  @ApiResponse({ status: 409, description: 'Cultura com este nome já existe' })
  async update(
    @Param('id') id: string,
    @Body() updateCropDto: UpdateCropDto,
  ): Promise<Crop> {
    return await this.cropService.update(id, updateCropDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover cultura' })
  @ApiResponse({ status: 204, description: 'Cultura removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Cultura não encontrada' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.cropService.remove(id);
  }
} 