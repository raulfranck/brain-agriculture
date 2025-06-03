// TODO: Criar a pasta 'modules' e importar os módulos de domínio (ProducerModule, FarmModule, etc) após criá-los.
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProducerModule } from './modules/producer/producer.module';
import { FarmModule } from './modules/farm/farm.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || 'postgres',
        database: process.env.DB_NAME || 'brain_agriculture',
        autoLoadEntities: true,
        synchronize: false, // Usar migrations
      }),
    }),
    ProducerModule,
    FarmModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
