/**
 * =====================================================
 * 认证模块 (Authentication Module)
 * =====================================================
 * 
 * @description
 * 用户认证和授权管理模块
 * 
 * @module AuthModule
 * 
 * @features
 * - 用户注册
 * - 用户登录
 * - JWT Token 生成
 * - 用户资料获取
 * 
 * @controllers
 * - AuthController: 认证相关 API 端点
 * 
 * @providers
 * - AuthService: 认证业务逻辑服务
 * 
 * @dependencies
 * - JwtModule: JWT Token 处理
 * - UsersModule: 用户数据管理
 * 
 * @api_endpoints
 * - POST /auth/register - 用户注册
 * - POST /auth/login - 用户登录
 * - GET /auth/profile/:id - 获取用户资料
 * 
 * @author SaaS Platform Team
 * @since 1.0.0
 */

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}