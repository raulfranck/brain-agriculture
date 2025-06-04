import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProducerService } from '../services/producer.service';
import { CreateProducerDto } from '../dtos/create-producer.dto';
import { UpdateProducerDto } from '../dtos/update-producer.dto';
import { Producer } from '../entities/producer.entity';

@ApiTags('producers')
@Controller('producers')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo produtor rural' })
  @ApiResponse({
    status: 201,
    description: 'Produtor criado com sucesso',
    type: Producer,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Documento já cadastrado' })
  async create(@Body() createProducerDto: CreateProducerDto): Promise<Producer> {
    return await this.producerService.create(createProducerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtores' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtores retornada com sucesso',
    type: [Producer],
  })
  async findAll(): Promise<Producer[]> {
    return await this.producerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produtor por ID' })
  @ApiParam({ name: 'id', description: 'ID do produtor (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Produtor encontrado',
    type: Producer,
  })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Producer> {
    return await this.producerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar produtor (PATCH)' })
  @ApiParam({ name: 'id', description: 'ID do produtor (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Produtor atualizado com sucesso',
    type: Producer,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  @ApiResponse({ status: 409, description: 'Documento já cadastrado por outro produtor' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProducerDto: UpdateProducerDto,
  ): Promise<Producer> {
    return await this.producerService.update(id, updateProducerDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar produtor (PUT)' })
  @ApiParam({ name: 'id', description: 'ID do produtor (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Produtor atualizado com sucesso',
    type: Producer,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  @ApiResponse({ status: 409, description: 'Documento já cadastrado por outro produtor' })
  async updatePut(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProducerDto: UpdateProducerDto,
  ): Promise<Producer> {
    return await this.producerService.update(id, updateProducerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir produtor' })
  @ApiParam({ name: 'id', description: 'ID do produtor (UUID)' })
  @ApiResponse({ status: 204, description: 'Produtor excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.producerService.remove(id);
  }
} 