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

  // ===== Role Endpoints =====
  @Post('roles')
  @HttpCode(HttpStatus.CREATED)
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.rolePermissionService.createRole(createRoleDto);
    return {
      success: true,
      data: role,
    };
  }

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
