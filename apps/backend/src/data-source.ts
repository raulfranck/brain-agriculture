import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'brain_agriculture',
  entities: [
    process.env.NODE_ENV === 'production'
      ? path.join(process.cwd(), 'dist/modules/**/entities/*.entity.js')
      : 'src/modules/**/entities/*.entity.{ts,js}',
  ],
  migrations: [
    process.env.NODE_ENV === 'production'
      ? path.join(process.cwd(), 'src/migrations/*.js')
      : 'src/migrations/*.{ts,js}',
  ],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
}); 