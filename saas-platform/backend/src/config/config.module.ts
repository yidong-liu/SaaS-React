/**
 * =====================================================
 * 配置模块 (Configuration Module)
 * =====================================================
 * 
 * @description
 * 配置管理模块，提供应用配置服务
 * 
 * @module ConfigModule
 * 
 * @providers
 * - ConfigService: 配置访问服务
 * 
 * @exports
 * - ConfigService: 导出供其他模块使用
 * 
 * @author SaaS Platform Team
 * @since 1.0.0
 */

import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
