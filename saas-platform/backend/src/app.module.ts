/**
 * =====================================================
 * 应用程序根模块 (Application Root Module)
 * =====================================================
 * 
 * @description
 * NestJS 应用的根模块，负责组织和管理所有功能模块
 * 
 * @module AppModule
 * 
 * @imports
 * - ConfigModule: 配置管理模块
 * - UsersModule: 用户管理模块
 * - AuthModule: 认证授权模块
 * - SubscriptionsModule: 订阅管理模块
 * 
 * @architecture
 * 采用模块化架构，每个业务领域独立封装为一个模块
 * 
 * @author SaaS Platform Team
 * @since 1.0.0
 */

import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { ConfigModule } from './config/config.module';

/**
 * 应用程序根模块
 * @description 整合所有功能模块，构建完整的应用程序
 */
@Module({
  imports: [
    ConfigModule,           // 配置管理
    UsersModule,            // 用户管理
    AuthModule,             // 认证授权
    SubscriptionsModule,    // 订阅管理
  ],
})
export class AppModule {}