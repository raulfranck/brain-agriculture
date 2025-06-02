import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Producer } from './modules/producer/entities/producer.entity';
import { Farm } from './modules/farm/entities/farm.entity';

config();

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Producer, Farm],
  migrations: ['dist/migrations/*.js'],
}); 