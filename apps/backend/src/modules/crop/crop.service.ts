import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Crop } from './entities/crop.entity';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';

@Injectable()
export class CropService {
  constructor(
    @InjectRepository(Crop)
    private readonly cropRepository: Repository<Crop>,
  ) {}

  async create(createCropDto: CreateCropDto): Promise<Crop> {
    try {
      const crop = this.cropRepository.create(createCropDto);
      return await this.cropRepository.save(crop);
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new ConflictException('Cultura com este nome já existe');
      }
      throw error;
    }
  }

  async findAll(): Promise<Crop[]> {
    return await this.cropRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Crop> {
    const crop = await this.cropRepository.findOne({
      where: { id },
      relations: ['harvests'],
    });

    if (!crop) {
      throw new NotFoundException(`Cultura com ID ${id} não encontrada`);
    }

    return crop;
  }

  async update(id: string, updateCropDto: UpdateCropDto): Promise<Crop> {
    const crop = await this.findOne(id);
    
    try {
      Object.assign(crop, updateCropDto);
      return await this.cropRepository.save(crop);
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new ConflictException('Cultura com este nome já existe');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const crop = await this.findOne(id);
    await this.cropRepository.remove(crop);
  }
} 