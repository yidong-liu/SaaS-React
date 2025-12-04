/**
 * =====================================================
 * 角色权限控制器 (Role & Permission Controller)
 * =====================================================
 * 
 * @description
 * 处理基于角色的访问控制 (RBAC) 相关的 HTTP 请求
 * 
 * @route /api/v1
 * 
 * @role_endpoints
 * - POST /api/v1/roles - 创建角色
 * - GET /api/v1/roles - 获取角色列表
 * - GET /api/v1/roles/:id - 获取角色详情
 * - PUT /api/v1/roles/:id - 更新角色
 * - DELETE /api/v1/roles/:id - 删除角色
 * 
 * @permission_endpoints
 * - POST /api/v1/permissions - 创建权限
 * - GET /api/v1/permissions - 获取权限列表
 * - GET /api/v1/permissions/:id - 获取权限详情
 * - DELETE /api/v1/permissions/:id - 删除权限
 * 
 * @role_permission_endpoints
 * - POST /api/v1/roles/:id/permissions - 为角色分配权限
 * - GET /api/v1/roles/:id/permissions - 获取角色的权限列表
 * 
 * @rbac_model
 * User -> UserRole -> Role -> RolePermission -> Permission
 * 
 * @features
 * - 角色 CRUD
 * - 权限 CRUD
 * - 角色权限关联
 * - 租户级别隔离
 * 
 * @author SaaS Platform Team
 * @since 1.0.0
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  RolePermissionService,
  CreateRoleDto,
  UpdateRoleDto,
  CreatePermissionDto,
  AssignPermissionsDto,
} from './role-permission.service';

@Controller('api/v1')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  // ==================== 角色管理端点 ====================
  
  /**
   * 创建角色
   * @route POST /api/v1/roles
   */
  @Post('roles')
  @HttpCode(HttpStatus.CREATED)
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.rolePermissionService.createRole(createRoleDto);
    return {
      success: true,
      data: role,
    };
  }

  /**
   * 获取角色列表
   * @route GET /api/v1/roles
   */
  @Get('roles')
  async findAllRoles(@Request() req: any) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    const roles = await this.rolePermissionService.findAllRoles(tenantId);
    return {
      success: true,
      data: roles,
    };
  }

  @Get('roles/:id')
  async findRole(@Param('id') id: string, @Request() req: any) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    const role = await this.rolePermissionService.findRole(id, tenantId);
    return {
      success: true,
      data: role,
    };
  }

  @Put('roles/:id')
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Request() req: any,
  ) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    const role = await this.rolePermissionService.updateRole(id, tenantId, updateRoleDto);
    return {
      success: true,
      data: role,
    };
  }

  @Delete('roles/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRole(@Param('id') id: string, @Request() req: any) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    await this.rolePermissionService.deleteRole(id, tenantId);
    return {
      success: true,
    };
  }

  @Post('roles/:id/permissions')
  async assignPermissions(
    @Param('id') roleId: string,
    @Body() body: { permissionIds: string[] },
    @Request() req: any,
  ) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    const role = await this.rolePermissionService.assignPermissionsToRole(
      { roleId, permissionIds: body.permissionIds },
      tenantId,
    );
    return {
      success: true,
      data: role,
    };
  }

  @Get('roles/:id/permissions')
  async getRolePermissions(@Param('id') id: string, @Request() req: any) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    const permissions = await this.rolePermissionService.getRolePermissions(id, tenantId);
    return {
      success: true,
      data: permissions,
    };
  }

  // ===== Permission Endpoints =====
  @Post('permissions')
  @HttpCode(HttpStatus.CREATED)
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    const permission = await this.rolePermissionService.createPermission(createPermissionDto);
    return {
      success: true,
      data: permission,
    };
  }

  @Get('permissions')
  async findAllPermissions() {
    const permissions = await this.rolePermissionService.findAllPermissions();
    return {
      success: true,
      data: permissions,
    };
  }

  @Get('permissions/resource/:resource')
  async findPermissionsByResource(@Param('resource') resource: string) {
    const permissions = await this.rolePermissionService.findPermissionsByResource(resource);
    return {
      success: true,
      data: permissions,
    };
  }

  @Delete('permissions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePermission(@Param('id') id: string) {
    await this.rolePermissionService.deletePermission(id);
    return {
      success: true,
    };
  }

  // ===== Permission Check =====
  @Get('check-permission')
  async checkPermission(
    @Query('userId') userId: string,
    @Query('resource') resource: string,
    @Query('action') action: string,
  ) {
    const hasPermission = await this.rolePermissionService.checkPermission(
      userId,
      resource,
      action,
    );
    return {
      success: true,
      data: { hasPermission },
    };
  }

  // ===== Seed Default Permissions =====
  @Post('permissions/seed')
  async seedDefaultPermissions() {
    await this.rolePermissionService.seedDefaultPermissions();
    return {
      success: true,
      message: 'Default permissions seeded successfully',
    };
  }
}
