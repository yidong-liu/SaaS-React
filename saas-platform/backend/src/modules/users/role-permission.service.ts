/**
 * =====================================================
 * 角色权限服务 (Role & Permission Service)
 * =====================================================
 * 
 * @description
 * RBAC (基于角色的访问控制) 核心业务逻辑服务
 * 
 * @responsibilities
 * - 角色管理 (创建、查询、更新、删除)
 * - 权限管理 (创建、查询、删除)
 * - 角色权限关联
 * - 权限检查
 * - 审计日志记录
 * 
 * @rbac_model
 * ```
 * User (用户)
 *   └─> UserRole (用户角色关联)
 *         └─> Role (角色)
 *               └─> RolePermission (角色权限关联)
 *                     └─> Permission (权限)
 * ```
 * 
 * @permission_format
 * - resource: 资源名称（如 users, posts）
 * - action: 操作类型（如 read, write, delete）
 * - 示例: users:read, posts:write
 * 
 * @system_roles
 * - admin: 系统管理员（所有权限）
 * - manager: 管理员（大部分权限）
 * - user: 普通用户（基础权限）
 * - guest: 访客（只读权限）
 * 
 * @multi_tenancy
 * 所有角色和权限都按租户隔离
 * 
 * @security
 * - 系统角色不可删除
 * - 权限变更自动审计
 * - 租户级别数据隔离
 * 
 * @author SaaS Platform Team
 * @since 1.0.0
 */

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

type Role = any;
type Permission = any;

/**
 * 创建角色 DTO
 */
export interface CreateRoleDto {
  tenantId: string;           // 租户 ID
  name: string;               // 角色名称
  description?: string;       // 角色描述
  permissionIds?: string[];   // 权限 ID 列表
}

/**
 * 更新角色 DTO
 */
export interface UpdateRoleDto {
  name?: string;              // 角色名称
  description?: string;       // 角色描述
}

/**
 * 创建权限 DTO
 */
export interface CreatePermissionDto {
  resource: string;           // 资源名称
  action: string;             // 操作类型
  description?: string;       // 权限描述
}

/**
 * 分配权限 DTO
 */
export interface AssignPermissionsDto {
  roleId: string;             // 角色 ID
  permissionIds: string[];    // 权限 ID 列表
}

@Injectable()
export class RolePermissionService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // ==================== 角色管理 ====================
  
  /**
   * 创建角色
   * @param createRoleDto - 角色创建数据
   * @returns 创建的角色对象
   * 
   * @throws ConflictException - 角色名已存在
   */
  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const { tenantId, name, permissionIds, ...roleData } = createRoleDto;

    // 检查角色名是否已存在
    const existing = await this.prisma.role.findUnique({
      where: {
        tenantId_name: {
          tenantId,
          name,
        },
      },
    });

    if (existing) {
      throw new ConflictException(`Role ${name} already exists in this tenant`);
    }

    const role = await this.prisma.role.create({
      data: {
        tenantId,
        name,
        ...roleData,
        permissions: permissionIds
          ? {
              create: permissionIds.map((permissionId) => ({
                permission: { connect: { id: permissionId } },
              })),
            }
          : undefined,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    // 记录审计日志
    await this.prisma.auditLog.create({
      data: {
        tenantId,
        action: 'ROLE_CREATED',
        resource: 'Role',
        details: { roleName: name },
      },
    });

    return role;
  }

  async findAllRoles(tenantId: string): Promise<Role[]> {
    return this.prisma.role.findMany({
      where: { tenantId },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: {
            userRoles: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findRole(id: string, tenantId: string): Promise<Role> {
    const role = await this.prisma.role.findFirst({
      where: { id, tenantId },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        userRoles: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async updateRole(id: string, tenantId: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findRole(id, tenantId);

    if (role.isSystem) {
      throw new ConflictException('Cannot modify system roles');
    }

    // 检查新名称是否冲突
    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existing = await this.prisma.role.findUnique({
        where: {
          tenantId_name: {
            tenantId,
            name: updateRoleDto.name,
          },
        },
      });

      if (existing) {
        throw new ConflictException(`Role ${updateRoleDto.name} already exists`);
      }
    }

    const updated = await this.prisma.role.update({
      where: { id },
      data: updateRoleDto,
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    // 记录审计日志
    await this.prisma.auditLog.create({
      data: {
        tenantId,
        action: 'ROLE_UPDATED',
        resource: 'Role',
        details: JSON.stringify({ roleId: id, changes: updateRoleDto }),
      },
    });

    return updated;
  }

  async deleteRole(id: string, tenantId: string): Promise<void> {
    const role = await this.findRole(id, tenantId);

    if (role.isSystem) {
      throw new ConflictException('Cannot delete system roles');
    }

    await this.prisma.role.delete({
      where: { id },
    });

    // 记录审计日志
    await this.prisma.auditLog.create({
      data: {
        tenantId,
        action: 'ROLE_DELETED',
        resource: 'Role',
        details: { roleId: id, roleName: role.name },
      },
    });
  }

  // ===== Permission Management =====
  async createPermission(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const { resource, action } = createPermissionDto;

    // 检查权限是否已存在
    const existing = await this.prisma.permission.findUnique({
      where: {
        resource_action: {
          resource,
          action,
        },
      },
    });

    if (existing) {
      throw new ConflictException(`Permission ${resource}:${action} already exists`);
    }

    return this.prisma.permission.create({
      data: createPermissionDto,
    });
  }

  async findAllPermissions(): Promise<Permission[]> {
    return this.prisma.permission.findMany({
      orderBy: [{ resource: 'asc' }, { action: 'asc' }],
    });
  }

  async findPermissionsByResource(resource: string): Promise<Permission[]> {
    return this.prisma.permission.findMany({
      where: { resource },
      orderBy: { action: 'asc' },
    });
  }

  async deletePermission(id: string): Promise<void> {
    await this.prisma.permission.delete({
      where: { id },
    });
  }

  // ===== Role-Permission Assignment =====
  async assignPermissionsToRole(assignDto: AssignPermissionsDto, tenantId: string): Promise<Role> {
    const { roleId, permissionIds } = assignDto;

    const role = await this.findRole(roleId, tenantId);

    if (role.isSystem) {
      throw new ConflictException('Cannot modify permissions of system roles');
    }

    // 验证所有权限都存在
    const permissions = await this.prisma.permission.findMany({
      where: {
        id: { in: permissionIds },
      },
    });

    if (permissions.length !== permissionIds.length) {
      throw new NotFoundException('One or more permissions not found');
    }

    // 删除现有权限
    await this.prisma.rolePermission.deleteMany({
      where: { roleId },
    });

    // 分配新权限
    const updated = await this.prisma.role.update({
      where: { id: roleId },
      data: {
        permissions: {
          create: permissionIds.map((permissionId) => ({
            permission: { connect: { id: permissionId } },
          })),
        },
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    // 记录审计日志
    await this.prisma.auditLog.create({
      data: {
        tenantId,
        action: 'PERMISSIONS_ASSIGNED',
        resource: 'Role',
        details: { roleId, permissionIds },
      },
    });

    return updated;
  }

  async getRolePermissions(roleId: string, tenantId: string): Promise<any[]> {
    const role = await this.findRole(roleId, tenantId);

    return (role as any).permissions?.map((rp: any) => rp.permission) || [];
  }

  // ===== Permission Checking =====
  async checkPermission(userId: string, resource: string, action: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return false;
    }

    for (const userRole of user.userRoles) {
      for (const rolePermission of userRole.role.permissions) {
        if (
          rolePermission.permission.resource === resource &&
          rolePermission.permission.action === action
        ) {
          return true;
        }
      }
    }

    return false;
  }

  // ===== Seed Default Permissions =====
  async seedDefaultPermissions(): Promise<void> {
    const defaultPermissions = [
      // User permissions
      { resource: 'user', action: 'create', description: 'Create users' },
      { resource: 'user', action: 'read', description: 'View users' },
      { resource: 'user', action: 'update', description: 'Update users' },
      { resource: 'user', action: 'delete', description: 'Delete users' },
      
      // Role permissions
      { resource: 'role', action: 'create', description: 'Create roles' },
      { resource: 'role', action: 'read', description: 'View roles' },
      { resource: 'role', action: 'update', description: 'Update roles' },
      { resource: 'role', action: 'delete', description: 'Delete roles' },
      
      // Tenant permissions
      { resource: 'tenant', action: 'read', description: 'View tenant info' },
      { resource: 'tenant', action: 'update', description: 'Update tenant settings' },
      
      // Subscription permissions
      { resource: 'subscription', action: 'read', description: 'View subscriptions' },
      { resource: 'subscription', action: 'update', description: 'Manage subscriptions' },
      
      // Audit log permissions
      { resource: 'audit', action: 'read', description: 'View audit logs' },
    ];

    for (const permission of defaultPermissions) {
      const existing = await this.prisma.permission.findUnique({
        where: {
          resource_action: {
            resource: permission.resource,
            action: permission.action,
          },
        },
      });

      if (!existing) {
        await this.prisma.permission.create({
          data: permission,
        });
      }
    }
  }
}
