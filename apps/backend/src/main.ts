import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors();

  // Configurar validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não definidas nos DTOs
      forbidNonWhitelisted: true, // Retorna erro se propriedades não permitidas forem enviadas
      transform: true, // Transforma automaticamente tipos primitivos
      transformOptions: {
        enableImplicitConversion: true, // Converte strings para números quando necessário
      },
    }),
  );

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Brain Agriculture API')
    .setDescription(
      'API para gerenciamento de produtores rurais e fazendas. ' +
      'Sistema completo de cadastro com validações de CPF/CNPJ e controle de áreas.'
    )
    .setVersion('1.0.0')
    .addTag('producers', 'Operações relacionadas aos produtores rurais')
    .addTag('farms', 'Operações relacionadas às fazendas')
    .addTag('health', 'Endpoints de monitoramento e saúde da aplicação')
    .setContact(
      'Brain Agriculture Team',
      'https://github.com/brain-agriculture',
      'contato@brain-agriculture.com'
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3000', 'Ambiente de Desenvolvimento')
    .addServer('https://api.brain-agriculture.com', 'Ambiente de Produção')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      syntaxHighlight: {
        theme: 'tomorrow-night',
      },
    },
    customSiteTitle: 'Brain Agriculture API Docs',
    customfavIcon: '🌾',
    customCss: `
      .topbar-wrapper img { content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><text y="20" font-size="20">🌾</text></svg>'); }
      .swagger-ui .topbar { background-color: #2d5a27; }
    `,
  });

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Aplicação rodando em: http://localhost:${port}`);
  console.log(`📚 Documentação Swagger: http://localhost:${port}/api/docs`);
  console.log(`❤️  Health Check: http://localhost:${port}/health`);
}

bootstrap();
