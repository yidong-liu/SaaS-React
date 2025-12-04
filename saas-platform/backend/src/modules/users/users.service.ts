/**
 * =====================================================
 * 用户服务 (Users Service)
 * =====================================================
 * 
 * @description
 * 用户管理的核心业务逻辑服务，处理用户的 CRUD 操作
 * 
 * @responsibilities
 * - 用户创建、查询、更新、删除
 * - 密码加密和验证
 * - 角色分配
 * - 权限查询
 * - 审计日志记录
 * 
 * @multi_tenancy
 * 所有操作都基于租户隔离，确保数据安全
 * 
 * @security
 * - 密码使用 bcrypt 加密（salt rounds: 12）
 * - 邮箱唯一性验证
 * - 租户级别的数据隔离
 * 
 * @database
 * 使用 Prisma ORM 操作 PostgreSQL 数据库
 * 
 * @audit
 * 关键操作自动记录审计日志
 * 
 * @author SaaS Platform Team
 * @since 1.0.0
 */

import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

type User = any;

/**
 * 用户状态枚举
 */
enum UserStatus {
  ACTIVE = 'ACTIVE',         // 活跃
  INACTIVE = 'INACTIVE',     // 未激活
  SUSPENDED = 'SUSPENDED',   // 暂停
  DELETED = 'DELETED'        // 已删除
}

/**
 * 创建用户数据传输对象
 */
export interface CreateUserDto {
  tenantId: string;      // 租户 ID
  email: string;         // 邮箱（唯一）
  username?: string;     // 用户名
  password: string;      // 密码（明文，将自动加密）
  firstName?: string;    // 名字
  lastName?: string;     // 姓氏
  phone?: string;        // 电话
  roleIds?: string[];    // 角色 ID 列表
}

/**
 * 更新用户数据传输对象
 */
export interface UpdateUserDto {
  email?: string;        // 邮箱
  username?: string;     // 用户名
  firstName?: string;    // 名字
  lastName?: string;     // 姓氏
  phone?: string;        // 电话
  avatar?: string;       // 头像 URL
  status?: UserStatus;   // 用户状态
}

/**
 * 分配角色数据传输对象
 */
export interface AssignRoleDto {
  userId: string;        // 用户 ID
  roleIds: string[];     // 角色 ID 列表
}

@Injectable()
export class UsersService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * 创建新用户
   * @param createUserDto - 用户创建数据
   * @returns 创建的用户对象（包含角色信息）
   * 
   * @throws NotFoundException - 租户不存在
   * @throws ConflictException - 邮箱已存在
   * 
   * @example
   * ```typescript
   * const user = await usersService.create({
   *   tenantId: 'tenant-id',
   *   email: 'user@example.com',
   *   password: 'password123',
   *   roleIds: ['role-id-1']
   * });
   * ```
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { tenantId, email, password, roleIds, ...userData } = createUserDto;

    // 检查租户是否存在
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
    }

    // 检查邮箱是否已存在
    const existingUser = await this.prisma.user.findUnique({
      where: {
        tenantId_email: {
          tenantId,
          email,
        },
      },
    });

    if (existingUser) {
      throw new ConflictException(`User with email ${email} already exists in this tenant`);
    }

    // 加密密码（使用 bcrypt，12 轮哈希）
    const hashedPassword = await bcrypt.hash(password, 12);

    // 创建用户
    const user = await this.prisma.user.create({
      data: {
        tenantId,
        email,
        password: hashedPassword,
        ...userData,
        userRoles: roleIds
          ? {
              create: roleIds.map((roleId) => ({
                role: { connect: { id: roleId } },
              })),
            }
          : undefined,
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    // 记录审计日志
    await this.createAuditLog({
      tenantId,
      userId: user.id,
      action: 'USER_CREATED',
      resource: 'User',
      details: { email: user.email },
    });

    return user;
  }

  async findAll(tenantId: string, page: number = 1, limit: number = 20): Promise<{ users: User[]; total: number }> {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { tenantId },
        skip,
        take: limit,
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where: { tenantId } }),
    ]);

    return { users, total };
  }

  async findOne(id: string, tenantId: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { id, tenantId },
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
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string, tenantId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        tenantId_email: {
          tenantId,
          email,
        },
      },
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
  }

  async update(id: string, tenantId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id, tenantId);

    // 如果更新邮箱，检查是否冲突
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          tenantId_email: {
            tenantId,
            email: updateUserDto.email,
          },
        },
      });

      if (existingUser) {
        throw new ConflictException(`Email ${updateUserDto.email} is already in use`);
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    // 记录审计日志
    await this.createAuditLog({
      tenantId,
      userId: id,
      action: 'USER_UPDATED',
      resource: 'User',
      details: updateUserDto,
    });

    return updatedUser;
  }

  async remove(id: string, tenantId: string): Promise<void> {
    await this.findOne(id, tenantId);

    await this.prisma.user.update({
      where: { id },
      data: { status: UserStatus.DELETED },
    });

    // 记录审计日志
    await this.createAuditLog({
      tenantId,
      userId: id,
      action: 'USER_DELETED',
      resource: 'User',
      details: { userId: id },
    });
  }

  async assignRoles(assignRoleDto: AssignRoleDto, tenantId: string): Promise<User> {
    const { userId, roleIds } = assignRoleDto;

    const user = await this.findOne(userId, tenantId);

    // 验证所有角色都属于同一租户
    const roles = await this.prisma.role.findMany({
      where: {
        id: { in: roleIds },
        tenantId,
      },
    });

    if (roles.length !== roleIds.length) {
      throw new BadRequestException('One or more roles not found or do not belong to this tenant');
    }

    // 删除现有角色
    await this.prisma.userRole.deleteMany({
      where: { userId },
    });

    // 分配新角色
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        userRoles: {
          create: roleIds.map((roleId) => ({
            role: { connect: { id: roleId } },
          })),
        },
      },
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

    // 记录审计日志
    await this.createAuditLog({
      tenantId,
      userId,
      action: 'ROLES_ASSIGNED',
      resource: 'User',
      details: { roleIds },
    });

    return updatedUser;
  }

  async getUserPermissions(userId: string, tenantId: string): Promise<string[]> {
    const user = await this.findOne(userId, tenantId);

    const permissions = new Set<string>();

    for (const userRole of (user as any).userRoles || []) {
      for (const rolePermission of userRole.role?.permissions || []) {
        permissions.add(`${rolePermission.permission.resource}:${rolePermission.permission.action}`);
      }
    }

    return Array.from(permissions);
  }

  async verifyPassword(userId: string, password: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      return false;
    }

    return bcrypt.compare(password, user.password);
  }

  async updatePassword(userId: string, newPassword: string, tenantId: string): Promise<void> {
    await this.findOne(userId, tenantId);

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // 记录审计日志
    await this.createAuditLog({
      tenantId,
      userId,
      action: 'PASSWORD_UPDATED',
      resource: 'User',
      details: { userId },
    });
  }

  private async createAuditLog(data: {
    tenantId: string;
    userId?: string;
    action: string;
    resource: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void> {
    await this.prisma.auditLog.create({
      data,
    });
  }

  async createUser(data: { email: string; password: string; firstName?: string; lastName?: string }): Promise<User> {
    // 默认使用第一个租户，实际应用中应该从上下文获取
    const tenant = await this.prisma.tenant.findFirst();
    if (!tenant) {
      throw new NotFoundException('No tenant found');
    }

    return this.create({
      tenantId: tenant.id,
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    });
  }

  async validateUserPassword(credentials: { email: string; password: string }): Promise<User> {
    // 默认使用第一个租户，实际应用中应该从上下文获取
    const tenant = await this.prisma.tenant.findFirst();
    if (!tenant) {
      throw new NotFoundException('No tenant found');
    }

    const user = await this.findByEmail(credentials.email, tenant.id);
    if (!user || !user.password) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    return user;
  }
}