/**
 * =====================================================
 * 用户模块 (Users Module)
 * =====================================================
 * 
 * @description
 * 用户管理核心模块，整合用户、租户、SSO、角色权限等功能
 * 
 * @module UsersModule
 * 
 * @features
 * - 用户 CRUD 操作
 * - 多租户管理
 * - SSO 单点登录
 * - 角色权限管理 (RBAC)
 * - 用户密码管理
 * 
 * @controllers
 * - UsersController: 用户管理 API
 * - TenantController: 租户管理 API
 * - SSOController: SSO 认证 API
 * - RolePermissionController: 角色权限 API
 * 
 * @providers
 * - UsersService: 用户业务逻辑
 * - TenantService: 租户业务逻辑
 * - SSOService: SSO 业务逻辑
 * - RolePermissionService: 角色权限业务逻辑
 * 
 * @imports
 * - JwtModule: JWT Token 管理
 * 
 * @exports
 * - 所有服务供其他模块使用
 * 
 * @architecture
 * 采用多租户架构，所有数据按租户隔离
 * 
 * @author SaaS Platform Team
 * @since 1.0.0
 */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { SSOController } from './sso.controller';
import { SSOService } from './sso.service';
import { RolePermissionController } from './role-permission.controller';
import { RolePermissionService } from './role-permission.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [UsersController, TenantController, SSOController, RolePermissionController],
  providers: [UsersService, TenantService, SSOService, RolePermissionService],
  exports: [UsersService, TenantService, SSOService, RolePermissionService],
})
export class UsersModule {}
