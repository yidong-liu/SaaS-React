import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import serverless from 'serverless-http';
import { AppModule } from '../src/app.module';

let server: any;

async function bootstrapHandler() {
  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), { logger: false });
  app.setGlobalPrefix('api'); // optional, 按需要配置
  // 配置 CORS 如果需要
  app.enableCors({
    origin: true,
    credentials: true
  });
  await app.init();
  return serverless(expressApp);
}

export default async function (req: any, res: any) {
  if (!server) {
    server = await bootstrapHandler();
  }
  return server(req, res);
}