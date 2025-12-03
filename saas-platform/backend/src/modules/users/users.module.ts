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
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [
    UsersController,
    TenantController,
    SSOController,
    RolePermissionController,
  ],
  providers: [
    UsersService,
    TenantService,
    SSOService,
    RolePermissionService,
  ],
  exports: [UsersService, TenantService, SSOService, RolePermissionService],
})
export class UsersModule {}