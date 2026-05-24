import 'reflect-metadata';
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { resolve } from 'node:path';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? 3000);
  const storageDir =
    process.env.STORAGE_DIR ?? resolve(process.cwd(), '..', 'storage');

  app.enableCors({ origin: true });
  app.use('/storage', express.static(storageDir));

  const config = new DocumentBuilder()
    .setTitle('系统 API')
    .setDescription('系统后端 API 文档')
    .setVersion('1.0')
    .addTag('job', '职位管理')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port, '0.0.0.0');
}

void bootstrap();
