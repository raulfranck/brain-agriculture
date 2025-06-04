// TODO: Criar a pasta 'modules' e importar os módulos de domínio (ProducerModule, FarmModule, etc) após criá-los.
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProducerModule } from './modules/producer/producer.module';
import { FarmModule } from './modules/farm/farm.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport: process.env.NODE_ENV === 'production' ? undefined : {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
            singleLine: false,
          },
        },
        serializers: {
          req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url,
            headers: {
              'user-agent': req.headers['user-agent'],
              'content-type': req.headers['content-type'],
            },
            remoteAddress: req.remoteAddress,
          }),
          res: (res) => ({
            statusCode: res.statusCode,
          }),
        },
        customProps: (req) => ({
          traceId: req.headers['x-trace-id'] || req.id,
        }),
        autoLogging: {
          ignore: (req) => req.url === '/health',
        },
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'brain_agriculture',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
    }),
    ProducerModule,
    FarmModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
