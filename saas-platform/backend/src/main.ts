/**
 * =====================================================
 * 应用程序入口文件 (Application Entry Point)
 * =====================================================
 * 
 * @description
 * NestJS 应用的主入口文件，负责启动和初始化整个应用
 * 
 * @responsibilities
 * - 创建 NestJS 应用实例
 * - 配置全局中间件和拦截器
 * - 启动 HTTP 服务器
 * - 配置 CORS 策略
 * 
 * @author SaaS Platform Team
 * @since 1.0.0
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * 启动应用程序
 * @description 异步函数，创建并启动 NestJS 应用
 */
async function bootstrap() {
  // 创建 NestJS 应用实例
  const app = await NestFactory.create(AppModule);
  
  // 启用跨域资源共享 (CORS)
  app.enableCors();
  
  // 启动 HTTP 服务器，监听 3000 端口
  await app.listen(3000);
  
  console.log('🚀 Application is running on: http://localhost:3000');
}

// 执行启动函数
bootstrap();