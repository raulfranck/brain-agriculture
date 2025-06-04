const { DataSource } = require('typeorm');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

module.exports = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'brain_agriculture',
  entities: [
    process.env.NODE_ENV === 'production'
      ? path.join(__dirname, '../dist/modules/**/entities/*.entity.js')
      : path.join(__dirname, 'modules/**/entities/*.entity.{ts,js}'),
  ],
  migrations: [
    path.join(__dirname, 'migrations/*.{ts,js}'),
  ],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
}); 